import styles from "./styles.module.scss";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

const parcelLayer = {
  id: "parcel",
  type: "fill",
  paint: {
    "fill-color": "#228B22",
  },
};

function DisplayParcel({ parcel }) {
  const geojson = JSON.parse(parcel["geojson"]);

  const [viewport, setViewport] = useState({
    longitude: (geojson["bbox"][0] + geojson["bbox"][2]) / 2,
    latitude: (geojson["bbox"][1] + geojson["bbox"][3]) / 2,
    zoom: 12,
  });
  const data = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: geojson,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <p>
        id: {parcel["id"]}
        <br />
        country: {parcel["country"]}
        <br />
        title: {parcel["title"]}
        <br />
        description: {parcel["description"]}
        <br />
        area: {parcel["area"]}
      </p>
      <div className={styles.map}>
        <ReactMapGL
          mapboxApiAccessToken="pk.eyJ1Ijoic2ltbHVhdGVkaCIsImEiOiJja3lyanRuMXowdW50MndveWg2dTc4ODVwIn0.8yaZhm6KvPDX0RETwBowtg"
          {...viewport}
          width="250px"
          height="250px"
          onViewportChange={setViewport}
          minZoom={9}
          maxZoom={12}
        >
          <Source id="my-data" type="geojson" data={data}>
            <Layer {...parcelLayer} />
          </Source>
        </ReactMapGL>
      </div>
    </div>
  );
}

export default DisplayParcel;
