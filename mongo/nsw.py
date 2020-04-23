import json
import urllib.request

def init_data():
    # get coronavirus data
    url = '/api/3/action/datastore_search?resource_id=21304414-1ff1-4243-a5d2-f52778048b29'
    i = 0
    df = []
    while url:
        fileobj = urllib.request.urlopen('https://data.nsw.gov.au/data'+url)
        filebytes = fileobj.read()
        s=str(filebytes,'utf-8')
        first_level = json.loads(s)

        df.extend(first_level['result']['records'])

        if len(first_level['result']['records']) > 0:
            url = first_level['result']['_links']['next']
        else:
            url = 0
        
        if 'offset' in first_level['result']:
            print(first_level['result'].keys(), first_level['result']['offset'], len(first_level['result']['records']))

    return json.dumps(df)

with open("COVID_data.json", "w") as f:
    f.write(init_data())