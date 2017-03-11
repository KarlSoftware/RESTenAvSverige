import psycopg2
from flask import Flask, request
from config import conn
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello World!!"

@app.route("/geografi")
def geografi():
    return "Hello World!!"

@app.route("/search")
def search():
    return "Hello World!!"

@app.route("/yrkesgrupper")
def yrkesgrupper():
    return "Hello World!!"


if __name__ == "__main__":
    app.run()
