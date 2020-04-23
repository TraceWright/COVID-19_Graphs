apt-get update
apt-get -y install python3 python3-pip
pip3 install pymongo[srv]

cd /docker-entrypoint-initdb.d
python3 nsw.py

# mongo coronavirus --eval "db.results.drop()"
# mongoimport --collection=results --db=coronavirus --file=/docker-entrypoint-initdb.d/COVID_data.json

# python3 ausData.py
# mongo coronavirus --eval "db.cases.drop()"
# mongoimport --collection=cases --db=coronavirus --file=/docker-entrypoint-initdb.d/COVID_aus.json

python3 importToAtlas.py

