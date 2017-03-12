#!/usr/bin/env python
# -*- coding: utf-8 -*-

import xml.etree.ElementTree as ET
import json

lan_tree = ET.parse('SWARJE_kommuner.svg')
lan_root = lan_tree.getroot()

def normalize_munip_name(kommunnamn):
	kommunnamn = kommunnamn.replace(' ','').lower().replace('å','a').replace('ä','a').replace('ö','o').replace('-','')
	kommunnamn = kommunnamn[:-1] if kommunnamn[-1] == 's' else kommunnamn
	return kommunnamn

lan_data = []
for path in lan_root[0][0]:
	kommunnamn = path.attrib['{http://www.safe.com/fme}KOMMUNNAMN'].strip()
	kommunnamn = normalize_munip_name(kommunnamn)
	polygon = path.attrib['d'].strip()
	lan_data.append((kommunnamn, polygon))

with open('swarje_kommuner.js', 'w') as f:
	f.write('{')
	f.write(','.join(map(lambda x: "%s:'%s'" % x, lan_data)))
	f.write('}')