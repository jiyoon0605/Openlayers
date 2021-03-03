import React from "react";
import {Map,Layers,layer} from "react-openlayers"

const Rotation = () => {
  return (
    <Map
      view={{
        center: [0, 0],
        zoom: 3,
        rotation: (Math.PI / 180) * 90,
      }}
    >
      <Layers>
        <layer.Tile />
      </Layers>
    </Map>
  );
};

export default Rotation;
