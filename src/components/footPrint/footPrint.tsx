import React, { useRef } from "react";
import { Map, Layers, layer } from "react-openlayers";
import Print from "./Print";
import * as ol from "openlayers";

const FootPrint = () => {
  const map = useRef();
  const coords:ol.Coordinate[] = [
    [-118.44102960000002, 33.961017600000005],
    [-118.38204720001693, 33.961017600000005],
    [-118.38204720001693, 33.924844800010376],
    [-118.44102960000002, 33.924844800010376],
    [-118.44102960000002, 33.961017600000005],
  ];



  return (
    <div>
      <Map
        ref={map}
        view={{
          center: [-13181512.158737104,4021141.9101320775],
          zoom: 14,
          projection: new ol.proj.Projection({
            code: "EPSG:3857",
            units: "m",
            extent: [
              -20037508.342789244,
              -20037508.342789244,
              20037508.342789244,
              20037508.342789244,
            ],
          }),
        }}
        
      >
        <Layers>
          <layer.Tile source={new ol.source.OSM()} />
        </Layers>
          <Print
            map={map}
            coords={coords}
          />
      </Map>

    </div>
  );
};

export default FootPrint;
