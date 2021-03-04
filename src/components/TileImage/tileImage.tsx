import { Map, layer, Layers } from "react-openlayers";
import * as ol from "openlayers";
import Image from "./img";

const TileImage = () => {
  const coords:ol.Coordinate[] = [
    [-118.44102960000002, 33.961017600000005],
    [-118.38204720001693, 33.961017600000005],
    [-118.38204720001693, 33.924844800010376],
    [-118.44102960000002, 33.924844800010376],
    [-118.44102960000002, 33.961017600000005],
  ];

  const extent:ol.Extent = [
    ol.proj.fromLonLat(coords[1])[0],
    ol.proj.fromLonLat(coords[1])[1],
    ol.proj.fromLonLat(coords[3])[0],
    ol.proj.fromLonLat(coords[3])[1],
  ];
  console.log(extent);
  var view = {
    center: ol.extent.getCenter(extent),
    zoom: 14,
    projection: new ol.proj.Projection({
      code: "EPSG:3857",
      extent: [
        -20037508.342789244,
        -20037508.342789244,
        20037508.342789244,
        20037508.342789244,
      ],
    }),
  };
  return (
    <Map view={view}>
      <Layers>
        <layer.Tile source={new ol.source.OSM()} renderBuffer={600} />
        <Image />
      </Layers>
    </Map>
  );
};

export default TileImage;
