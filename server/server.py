import psycopg2
import json
from flask import Flask, request, jsonify
from config import conn
app = Flask(__name__)

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
            if kommun[1] not in result:
                result[kommun[1]] = {
                    'lansnamn': kommun[2],
                    'lanskod': kommun[2],
                    'kommuner': []
                }

            result[kommun[1]]['kommuner'].append({
                'kommunnamn': kommun[0],
                'kommunkod': kommun[1]
            })

        return jsonify(result)

@app.route("/search")
def search():
    return "Hello World!!"

@app.route("/yrkesgrupper")
def yrkesgrupper():
    with conn.cursor() as cursor:
        query = "SELECT yrkesgrupp_id, yrkesgrupp FROM h4s.yrkesgrupper"
        cursor.execute(query)
        result = map(lambda x: {'yrkesgrupp_id': x[0], 'yrkesgrupp': x[1]}, cursor.fetchall())
        return jsonify(result)


if __name__ == "__main__":
    app.run()
