import json
from mapbox import Static

service = Static()

parcels = json.load(open('parcel.json'))

i = 0
for p in parcels:
    geo = json.loads(p['geojson'])
    geo_bbox = geo['bbox']
    # unfortunately the python lib doesn't support multipolygons to be added
    # therefor just render a square tile of the top left of the bounding box
    # multipoly = geo['coordinates']
    geo_feature = {
        'type': 'Feature',
        'properties': {'name': p['description']},
        'geometry': {
            'type': 'Point',
            'coordinates': [geo_bbox[0], geo_bbox[1]],
        },
    }
    # 350x350 would be good
    response = service.image('mapbox.satellite', features=[geo_feature])

    # create image file
    with open(f'./images/{i}.png', 'wb') as output:
        _ = output.write(response.content)

    i += 1
