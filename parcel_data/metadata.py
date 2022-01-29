import json
import time
import datetime


parcels = json.load(open('parcels.json'))
ipfsBaseURL = 'ipfs://QmSwcMCafrzkvtBicQrNvZJy56D2V5AMEgXM4RryRCKMCn/'

i = 0
for p in parcels:
    stock_ts = round(time.mktime(datetime.datetime.strptime(p['stock_ts'], "%Y-%m-%d").timetuple()))

    # https://docs.opensea.io/docs/metadata-standards

    metadata = {
        'name': p['id'],
        'description': p['description'],
        'attributes': [
            {
                'trait_type': 'country',
                'value': p['country'],
            },
            {
                'trait_type': 'stock_ts',
                'display_type': 'date',
                'value': stock_ts,
            },
            {
                'trait_type': 'stock',
                'value': p['stock'],
            },
            {
                'trait_type': 'area',
                'value': p['area'],
            },
            {
                'trait_type': 'geojson',
                'value': p['geojson'],
            },
        ],
        'image': f'{ipfsBaseURL}/{i}.png',
    }

    # create metadata file
    with open(f'./metadata/{i}', 'w') as output:
        _ = output.write(json.dumps(metadata))

    i += 1
