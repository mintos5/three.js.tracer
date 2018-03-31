#!/usr/bin/python3
import csv
import sys
import requests

if '__main__' == __name__:
	if len(sys.argv) < 2:
		print ("Missing arument for file!")
		sys.exit(1)	
	print ("Working with file: " + sys.argv[1])
	data = []
	url = "http://freegeoip.net/json/"

	with open(sys.argv[1]) as csvfile:
		readCSV = csv.reader(csvfile,delimiter=',')
		data = list(readCSV)
	for row in data:
		if not isinstance(row[2],str):
			row.append("")
			continue
		if row[2] == '' or row[2] == '*':
			row.append("")
			continue	
		response = requests.get(url+row[2])
		if response.ok:
			responseData = response.json()
			row[4] = responseData["latitude"]
			row.append(responseData["longitude"])
		else:
			print(response.status_code)
		print (row)
	with open(sys.argv[1],"w") as csvfile:
		writeCSV = csv.writer(csvfile, delimiter=',',quoting=csv.QUOTE_MINIMAL)
		writeCSV.writerows(data)
