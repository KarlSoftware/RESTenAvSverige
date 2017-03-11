import psycopg2

DBNAME=''
USER=''
PASSWORD=''
HOST=''

conn = psycopg2.connect(dbname=DBNAME, user=USER, password=PASSWORD, host=HOST)