import React, { useState, useEffect } from "react";
import { layer, Interactions, Layers, interaction } from "react-openlayers";
import * as ol from "openlayers";
import Image from "../TileImage/image";


type Props = {
  map: any;
  coords:ol.Coordinate[]
};

const Print :React.FC<Props>= ({ map, coords}) => {
  
  const [zoom, setZoom] = useState(3);
  const [rotation, setRotation] = useState(0);
  const [reRend, setReRend] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    setReRend(!reRend);
  }, [zoom, angle, rotation]);
  useEffect(() => {
    map.current.map.on("moveend", (e:any) => {
      setZoom(e.map.getView().getZoom());
      setRotation(e.map.getView().getRotation());
    });
  }, [map]);

  const tmpCoord = [];
  for (let coord of coords) {
    tmpCoord.push(ol.proj.fromLonLat(coord));
  }

  const center = [
    (tmpCoord[2][0] - tmpCoord[0][0]) / 2 + tmpCoord[0][0],
    (tmpCoord[2][1] - tmpCoord[0][1]) / 2 + tmpCoord[0][1],
  ];
  const coord:ol.Coordinate[] = [];
  const r = Math.PI / 180;
  const radian = r * angle;
  for (let t of tmpCoord) {
    const c = ol.coordinate.rotate(
      [t[0] - center[0], t[1] - center[1]],
      radian
    );
    coord.push([c[0] + center[0], c[1] + center[1]]);
  }

  const features = [new ol.Feature(new ol.geom.Polygon([coord]))];

  const source = new ol.source.Vector({
    features: features,
  });

  const style = [
    new ol.style.Style({
      text: new ol.style.Text({
        font: `${Math.round(zoom) * 3}px sans-serif`,
        fill: new ol.style.Fill({ color: "#fff" }),
        backgroundFill: new ol.style.Fill({ color: "#000" }),
        textAlign: "left",
        text: zoom > 10 ? "name" : "",
        offsetY: Math.round(zoom) * 1.5,
        rotation: -radian + rotation,
      }),
      geometry: function (feature) {
        const geom:any = feature.getGeometry();
        const coordinates:ol.Coordinate=geom.getCoordinates()[0][0];
        return new ol.geom.Point(coordinates);
      },
    }),
    new ol.style.Style({
      text: new ol.style.Text({
        font: `${Math.round(zoom) * 2}px sans-serif`,
        fill: new ol.style.Fill({ color: "#fff" }),
        backgroundFill: new ol.style.Fill({ color: "#000" }),
        textAlign: "right",
        text: zoom > 12 ? "2021-01-26 15:02" : "",
        offsetY: -Math.round(zoom),
        rotation: -radian + rotation,
      }),
      geometry: function (feature) {
        let geom:any = feature.getGeometry()
        const coordinates=geom.getCoordinates()[0][2];
        return new ol.geom.Point(coordinates);
      },
    }),

    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: "#003bed",
        width: 5,
      }),
    }),
  ];

  const selectPointerMove = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    style: () => {
      const pointerMoveStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "gray",
          width: 7,
        }),
      });
      style.push(pointerMoveStyle);
      return style;
    },
  });

  const selectDoubleClick = new ol.interaction.Select({
    condition: ol.events.condition.doubleClick,
    style: () => {
      const doubleClickStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "black",
          width: 8,
        }),
      });
      style.push(doubleClickStyle);
      return style;
    },
  });

  return (
    <div>
      <button onClick={() => setAngle(angle + 5)}>◀ 회전 </button>
      <button onClick={() => setAngle(angle - 5)}> 회전 ▶</button>
      <Layers>
        <layer.Vector source={source} style={style} zIndex={20} />
        {/* <Image angle={angle} /> */}
      </Layers>

      <Interactions>
        <interaction.Select features={features} instance={selectPointerMove} />
        <interaction.Select features={features} instance={selectDoubleClick} />
      </Interactions>
    </div>
  );
};

export default Print;
