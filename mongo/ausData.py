import json
import urllib.request
from io import StringIO
import csv
import re

def init_data():
    # # get Aus coronavirus data
    url = 'https://raw.githubusercontent.com/'
    uri = 'CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
    urllib.request.urlretrieve(url+uri, 'covidGlobalConfirmed.csv')

    p = re.compile(r"(\d{1,2})\/(\d{1,2})\/(\d{1,2})")
    with open('covidGlobalConfirmed.csv', newline='') as f:
        data = csv.DictReader(f)

        with open("COVID_aus.json", "w") as f:
            for row in data:
                if row['Country/Region'] == 'Australia':
                    valueData = []
                    for k, v in row.items():
                        if p.match(k):
                            dateExpand = p.match(k).groups()
                            dateISO = f"20{dateExpand[2]}-{int(dateExpand[0]):02}-{int(dateExpand[1]):02}T00:00:00.000Z"
                            mongoData = {}
                            mongoData["value"] = int(v)
                            mongoData["date"] = dateISO
                            valueData.append(mongoData)
                    f.write(json.dumps({'state': row['Province/State'], 'timeseries': valueData})+'\n')

init_data()
