apt-get update
apt-get -y install python3
python3 nsw.py
mongoimport --collection=results --db=coronavirus --file=/docker-entrypoint-initdb.d/COVID_data.json
