import React from "react";
import {
  interaction,
  layer,
  Interactions,
  Map,
  Layers,
} from "react-openlayers";
import * as ol from "openlayers";

const Polygon = () => {
  const coordinates:ol.Coordinate[][] = [];
  let coords = localStorage.getItem("polygon");

  if (coords) {
  const coordsArray = coords.split("/");
    coordsArray.pop();
    for (let i = 0; i < coordsArray.length; i++) {
      let c = coordsArray[i].split(",");
      c = c.filter((e) => e !== "");
      const tmp:ol.Coordinate[] = [];

      for (let j = 0; j < c.length; j += 2) {
        tmp.push([+c[j], +c[j + 1]]);
      }
      coordinates.push(tmp);
    }
    console.log(coordinates);
  }

  const features = [new ol.Feature(new ol.geom.Polygon(coordinates))];

  const rasterTile = new ol.source.OSM();
  const vectorSource = new ol.source.Vector({
    features: features,
    wrapX: false,
  });

  var styles = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#F88008",
        width: 3,
      }),
      fill: new ol.style.Fill({
        color: "rgba(255, 240, 0, 0.2)",
      }),
    }),
  ];

  const saveCoord = (features:ol.Feature[]) => {
    const coordStr = [];
    for (let f of features) {
      const geom:any = f.getGeometry()
      const coords=geom.getCoordinates();
      for (let coord of coords) {
        coordStr.push(coord.join());
      }
    }
    const saved = [];
    for (let i = 0; i < coordStr.length; i++) {
      saved.push(`${coordStr[i]}/`);
    }

    localStorage.setItem("polygon", saved.join(','));
  };

  return (
    <div onClick={() => saveCoord(vectorSource.getFeatures())}>
      <Map
        view={{
          center: [0, 0],
          zoom: 3,
        }}
      >
        <Layers>
          <layer.Tile source={rasterTile} />
          <layer.Vector source={vectorSource} style={styles} />
        </Layers>
        <Interactions>
          <interaction.Draw source={vectorSource} type="Polygon" />
          <interaction.Modify source={vectorSource} />
        </Interactions>
      </Map>
    </div>
  );
};

export default Polygon;
