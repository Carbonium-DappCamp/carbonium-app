import json

parcels = json.load(open('parcel.json'))
ipfsBaseURL = 'ipfs://QmeyFx44fGc58661j9gTcpdq48pMfyb6TmixcHwKNW8Fmo'

i = 0
for p in parcels:

    metadata = {
        'attributes': {
            'id': p['id'],
            'country': p['country'],
            'title': p['title'],
            'description': p['description'],
            'area': p['area'],
            'geojson': p['geojson'],
        },
        'image': f'{ipfsBaseURL}/{i}.png',
    }

    # create metadata file
    with open(f'./metadata/{i}', 'w') as output:
        _ = output.write(json.dumps(metadata))

    i += 1