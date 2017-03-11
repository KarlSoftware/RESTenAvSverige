import psycopg2
from flask import Flask, request
from config import conn
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello World!!"

@app.route("/geografi")
def geografi():
	print(conn)
	with conn.cursor() as cursor:
		query = "SELECT kommunnamn, kommunkod, lansnamn, lanskod, booli_id FROM RESTenAvSverige.kommuner"
    	
    	result = {}
    	for kommun in cursor:
    		if kommun['kommunkod'] not in result:
    			result[kommun['kommunkod']] = {
    				'lansnamn': kommun['lansnamn'],
    				'lanskod': kommun['lanskod'],
    				'kommuner': {}
    			}

    		result[kommun['kommunkod']]['kommuner'].append({
    			'kommunnamn': kommun['kommunnamn'],
    			'kommunkod': kommun['kommunkod']
			})

    	return json.dumps(result)

@app.route("/search")
def search():
    return "Hello World!!"

@app.route("/yrkesgrupper")
def yrkesgrupper():
    return "Hello World!!"


if __name__ == "__main__":
    app.run()
