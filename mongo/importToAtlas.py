import json
from env import *
from pymongo import MongoClient

mongo_client = MongoClient(f"mongodb+srv://{MONGO_DB_USERNAME}:{MONGO_DB_PASSWORD}@{MONGO_DB_ENDPOINT}")

with open("COVID_aus.json") as f:
  aus_data = json.load(f)

colAus = mongo_client.coronavirus.cases
colAus.drop()
colAus.insert_many(aus_data)

with open("COVID_data.json") as f:
  nsw_data = json.load(f)

colNsw = mongo_client.coronavirus.results
colNsw.drop()
colNsw.insert_many(nsw_data)

mongo_client.close()
