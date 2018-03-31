#!/bin/bash
for file in `find *.csv`
do
	../addGeoInfo.py `readlink -f $file`
	echo ""
done
