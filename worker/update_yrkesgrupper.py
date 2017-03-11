import psycopg2, psycopg2.extras
import requests
import json
from config import conn

DATA_URL = 'http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=%d'

CREATE_QUERY = """
	CREATE TABLE IF NOT EXISTS h4s.yrkesgrupper (
	yrkesgrupp_id int PRIMARY KEY,
	yrkesomrade_id int,
	yrkesgrupp varchar(100) NOT NULL
	);
	TRUNCATE TABLE h4s.yrkesgrupper
"""

INSERT_QUERY = 'INSERT INTO h4s.yrkesgrupper VALUES %s'
SELECT_QUERY = 'SELECT yrkesomrade_id FROM h4s.yrkesomraden'

headers = {
	'Accept': 'application/json',
	'Accept-Language': 'sv'
}

with conn.cursor() as cursor:
	cursor.execute(CREATE_QUERY)
	cursor.execute(SELECT_QUERY)
	for yrkesomrade in cursor:
		print('Calling API for ID: %d' % yrkesomrade[0])
		r = requests.get(DATA_URL % yrkesomrade[0], headers=headers)
		data = json.loads(r.text)
		
		print('Fetched %d elements' % len(data['soklista']['sokdata']))
		insert_data = []
		for yrkesgrupper in data['soklista']['sokdata']:
			insert_data.append((yrkesgrupper['id'], yrkesomrade[0], yrkesgrupper['namn']))
		
		print('Inserting into database...')
		with conn.cursor() as cursor2:
			psycopg2.extras.execute_values (
			    cursor2, INSERT_QUERY, insert_data, template=None, page_size=100
			)

			conn.commit()

print('Done')
