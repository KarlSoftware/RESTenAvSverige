import psycopg2, psycopg2.extras
import requests
import json
from config import conn

DATA_URL = 'http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden'

CREATE_QUERY = """
	CREATE TABLE IF NOT EXISTS h4s.yrkesomraden (
		yrkesomrade_id int PRIMARY KEY,
		yrkesomrade varchar(100) NOT NULL
	);
	TRUNCATE TABLE h4s.yrkesomraden
"""

INSERT_QUERY = 'INSERT INTO h4s.yrkesomraden VALUES %s'

headers = {
	'Accept': 'application/json',
	'Accept-Language': 'sv'
}

print('Calling API...')

r = requests.get(DATA_URL, headers=headers)
data = json.loads(r.text)

print('Fetched %d elements' % len(data['soklista']['sokdata']))

insert_data = []
for yrkesomrade in data['soklista']['sokdata']:
	insert_data.append((yrkesomrade['id'], yrkesomrade['namn']))

print('Inserting into database...')

with conn.cursor() as cursor:
	cursor.execute(CREATE_QUERY)
	psycopg2.extras.execute_values (
	    cursor, INSERT_QUERY, insert_data, template=None, page_size=100
	)
	conn.commit()

print('Done')