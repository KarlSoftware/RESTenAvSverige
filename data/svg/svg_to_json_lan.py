#!/usr/bin/env python
# -*- coding: utf-8 -*-

import xml.etree.ElementTree as ET
import json

lan_tree = ET.parse('SWARJE_lan.svg')
lan_root = lan_tree.getroot()

lan_data = []
for path in lan_root[0][0]:
	lansnamn = path.attrib['{http://www.safe.com/fme}LANSNAMN'].strip()
	lansnamn = lansnamn.replace(' län','').replace(' ','').lower().replace('å','a').replace('ä','a').replace('ö','o')
	lansnamn = lansnamn[:-1] if lansnamn[-1] == 's' else lansnamn
	polygon = path.attrib['d'].strip()
	#print(lansnamn, polygon)
	#print(lansnamn)
	lan_data.append((lansnamn, polygon))

with open('swarje_lan.js', 'w') as f:
	f.write('{')
	f.write(','.join(map(lambda x: "%s:'%s'" % x, lan_data)))
	f.write('}')