#!/usr/bin/env python
# -*- coding: utf-8 -*-

import xml.etree.ElementTree as ET
import json

lan_tree = ET.parse('SWARJE_lan.svg')
lan_root = lan_tree.getroot()

def normalize_county_name(lansnamn):
	lansnamn = lansnamn.replace(' län','').replace(' ','').lower().replace('å','a').replace('ä','a').replace('ö','o').replace('-','')
	lansnamn = lansnamn[:-1] if lansnamn[-1] == 's' else lansnamn
	return lansnamn

lan_data = []
for path in lan_root[0][0]:
	lansnamn = path.attrib['{http://www.safe.com/fme}LANSNAMN'].strip()
	lansnamn = normalize_county_name(lansnamn)
	
	lanskod = int(path.attrib['{http://www.safe.com/fme}LANSKOD'].strip())

	polygon = path.attrib['d'].strip()
	lan_data.append((str(lanskod), polygon))

with open('swarje_lan.js', 'w') as f:
	f.write('{')
	f.write(','.join(map(lambda x: "%s:'%s'" % x, lan_data)))
	f.write('}')