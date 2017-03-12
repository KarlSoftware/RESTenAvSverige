import psycopg2
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import conn
app = Flask(__name__)
CORS(app)

def normalize_county_name(lansnamn):
    lansnamn = lansnamn.replace(' län','').replace(' ','').lower().replace('å','a').replace('ä','a').replace('ö','o').replace('-','')
    lansnamn = lansnamn[:-1] if lansnamn[-1] == 's' else lansnamn
    return lansnamn

def normalize_munip_name(kommunnamn):
    kommunnamn = kommunnamn.replace(' ','').lower().replace('å','a').replace('ä','a').replace('ö','o').replace('-','')
    kommunnamn = kommunnamn[:-1] if kommunnamn[-1] == 's' else kommunnamn
    return kommunnamn

@app.route("/")
def index():
    return "Hello World!!"

@app.route("/geografi")
def geografi():
    with conn.cursor() as cursor:
        query = "SELECT kommunnamn, kommunkod, lansnamn, lanskod, booli_id FROM h4s.kommuner"
        cursor.execute(query)

        result = {}
        for kommun in cursor:
            if kommun[3] not in result:
                result[kommun[3]] = {
                    'lansnamn': kommun[2],
                    'lansnamn_short': normalize_county_name(kommun[2]),
                    'lanskod': kommun[3],
                    'kommuner': []
                }

            result[kommun[3]]['kommuner'].append({
                'kommunnamn': kommun[0],
                'kommunnamn_short': normalize_munip_name(kommun[0]),
                'kommunkod': kommun[1]
            })

        return jsonify(result)

@app.route("/search", methods=['POST'])
def search():
    parameters = request.get_json(silent=True)
    if not parameters or 'yrkesgrupper' not in parameters or len(parameters['yrkesgrupper']) < 1:
        return jsonify({'error': 'not enough parameters'})
    narliggande = True if 'narliggande' in parameters and parameters['narliggande'] else False
    yrkesgrupper_id = parameters['yrkesgrupper']

    with conn.cursor() as cursor:
        query = """
        SELECT h4s.kommuner.kommunkod, lanskod, befolkning, platser.a1, platser.a2
        FROM h4s.kommuner
        LEFT JOIN (SELECT SUM(antal_nara::int) as a1, SUM(antal_exakt::int) as a2, h4s.platsbank.kommunkod FROM h4s.platsbank WHERE yrkesgrupp_id IN (%s) GROUP BY kommunkod) as platser
        ON platser.kommunkod = h4s.kommuner.kommunkod
        """ % (','.join(map(lambda x: str(int(x)), yrkesgrupper_id)))
        
        print('Query: %s' % query)
        cursor.execute(query)

        # Choose exact or nearby
        kommuner = cursor.fetchall()
        if not kommuner:
            return jsonify({'error': 'empty result'})
        kommuner = map(lambda x: (x[3] if narliggande else x[4], x[0], x[1], x[2]), kommuner)
        kommuner = list(map(lambda k: tuple(map(int, k)), kommuner))
        print(kommuner)
        
    # Get min/max values
    platser = list(map(lambda x: float(x[0])/x[3], kommuner))  # (Antal platser)/(antal personer)
    min_platser = min(platser)
    max_platser = max(platser)
    
    # Scale values to [0,1]
    kommuner = map(lambda x: ((float(x[0])/x[3]-min_platser)/(max_platser-min_platser), x[1], x[2]), kommuner)

    # Sort into counties
    lan = {}
    for kommun in kommuner:
        if kommun[2] not in lan:
            lan[kommun[2]] = {
                'goodness': 0.0,
                'kommuner': {}
            }

        lan[kommun[2]]['kommuner'][kommun[1]] = {
            'goodness': kommun[0]
        }

    # Aggregate county goodness
    average_goodness = lambda l: float(sum(map(lambda k: k['goodness'], l)))/len(l)
    lan = { key: {'kommuner': l['kommuner'], 'goodness': average_goodness(l['kommuner'].values())} for key,l in lan.items()}

    return jsonify(lan)
    
@app.route("/yrkesgrupper")
def yrkesgrupper():
    with conn.cursor() as cursor:
        query = "SELECT yrkesgrupp_id, yrkesgrupp FROM h4s.yrkesgrupper"
        cursor.execute(query)
        result = list(map(lambda x: {'yrkesgrupp_id': x[0], 'yrkesgrupp': x[1]}, cursor.fetchall()))
        return jsonify(result)


if __name__ == "__main__":
    app.run()
