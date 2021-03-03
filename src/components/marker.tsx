import React from "react";
import {
  Interactions,
  Layers,
  Controls,
  layer,
  interaction,
  Map,
} from "react-openlayers";
import * as ol from "openlayers";

const Marker = () => {
  let markerCoord = localStorage.getItem("markers");

  const features = [];

  if (markerCoord) {
   const markerArray=markerCoord.split(",");
    for (let i = 0; i < markerArray.length; i += 2) {
      features.push(
        new ol.Feature(new ol.geom.Point([Number(markerArray[i]), Number(markerArray[i + 1])]))
      );
    }
  }


  const rasterTile = new ol.source.OSM();
  const vector = new ol.source.Vector({
    features: features,
    wrapX: false,
  });

  const styles = [
    new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src:
          "https://icons.veryicon.com/png/System/Small%20%26%20Flat/map%20marker.png",
        scale: 0.03,
      }),
    }),
  ];

  const getCoord = (features:ol.Feature[]) => {
    const markers = [];
    for (let f of features) {
      const geom:any=f.getGeometry()
      markers.push(geom.getCoordinates());
    }
    localStorage.setItem("markers", markers.join(','));
  };

  return (
    <div onClick={(e) => getCoord(vector.getFeatures())}>
      <Map
        view={{
          center: [0, 0],
          zoom: 3,
        }}
      >
        <Layers>
          <layer.Tile  source={rasterTile}/>
          <layer.Vector source={vector} style={styles} />
        </Layers>
        <Interactions>
          <interaction.Draw source={vector} type="Point" />
          <interaction.Modify source={vector} />
        </Interactions>
        <Controls></Controls>
      </Map>
    </div>
  );
};

export default Marker;
