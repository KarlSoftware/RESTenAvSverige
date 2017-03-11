import psycopg2

DBNAME=''
USER=''
password=''
HOST=''

conn = psycopg2.connect(dbname=DBNAME, user=USER, password=PASSOWRD, host=HOST)