import React from "react";
import * as ol from "openlayers";
import { layer, Map, Layers } from "react-openlayers";

const FootTraffic = () => {
  const count = 150;
  const features = new Array(count);
  const e = 100000;

  for (let i = 0; i < count; ++i) {
    const coordinates:ol.Coordinate = [
      2 * e * Math.random() - e + 800000,
      2 * e * Math.random() - e + 800000,
    ];
    features[i] = new ol.Feature(new ol.geom.Point(coordinates));
  }

  const source = new ol.source.Vector({
    features: features,
  });
  const clusterSource = new ol.source.Cluster({
    distance: 30,
    source: source,
  });

  let styleCache:any = {};

  const style = (feature:ol.Feature) => {
    const size = feature.get("features").length;
    let style = styleCache[size];

    if (!style) {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius:  size,
          stroke: new ol.style.Stroke({
            color: "#000",
          }),
          fill: new ol.style.Fill({
            color: "rgba(0,0,0,0.7)",
          }),
        }),
        text: new ol.style.Text({
          text: size > 1 ? size.toString() : "",
          fill: new ol.style.Fill({
            color: "#fff",
          }),
        }),
      });

      styleCache[size] = style;
    }
    return style;
  };
  const rasterTile = new ol.source.OSM();

  //2
  let styleCache2:any = {};

  const style2 = (feature:ol.Feature) => {
    const size = feature.get("features").length;
    let style2 = styleCache2[size];

    if (!style2) {
      style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: size,
          stroke: new ol.style.Stroke({
            color: "#000",
          }),
          fill: new ol.style.Fill({
            color: "rgba(180, 120, 215,0.7)",
          }),
        }),
        text: new ol.style.Text({
          text: size > 1 ? size.toString() : "",
          fill: new ol.style.Fill({
            color: "#fff",
          }),
        }),
      });

      styleCache2[size] = style2;
    }
    return style2;
  };

  for (let i = 0; i < count; ++i) {
    const coordinates:ol.Coordinate = [
      2 * e * Math.random() - e + 800000,
      2 * e * Math.random() - e + 800000,
    ];
    features[i] = new ol.Feature(new ol.geom.Point(coordinates));
  }

  const source2 = new ol.source.Vector({
    features: features,
  });
  const clusterSource2 = new ol.source.Cluster({
    distance: 30,
    source: source2,
  });

  return (
    <Map>
      <Layers>
        <layer.Tile source={rasterTile} />
        <layer.Vector source={clusterSource} style={(f:ol.Feature) => style(f)} />
        <layer.Vector source={clusterSource2} style={(f:ol.Feature) => style2(f)} />
      </Layers>
    </Map>
  );
};

export default FootTraffic;
