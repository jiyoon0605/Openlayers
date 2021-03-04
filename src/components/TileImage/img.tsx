import React, { useEffect, useState } from "react";
import axios from "axios";
import { adjustImage, getMinMaxWo2Percent, rawImagePb2Image } from "../../util";
import {Coordinate,rotate}from 'ol/coordinate'
import {fromLonLat,get,addProjection,addCoordinateTransforms,transform} from 'ol/proj'
import {Extent,getCenter} from 'ol/extent'
import Projection from 'ol/proj/Projection';
import Static from "ol/source/ImageStatic";
import { Image as ImageLayer, Tile as TileLayer } from "ol/layer";
import OSM from "ol/source/OSM";
import Map from "ol/Map";
import View from "ol/View";

const Image = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [angle, setAngle] = useState(0);
  const coords:Coordinate[] = [
    [-118.44102960000002, 33.961017600000005],
    [-118.38204720001693, 33.961017600000005],
    [-118.38204720001693, 33.924844800010376],
    [-118.44102960000002, 33.924844800010376],
    [-118.44102960000002, 33.961017600000005],
  ];
  const coord = [];
  for (let c of coords) {
    coord.push(fromLonLat(c));
  }
  const extent:Extent = [coord[3][0], coord[3][1], coord[1][0], coord[1][1]];

  const projection:any = new Projection({
    code: "EPSG:3857",
  });

  const rotateProjection = (angle:number, anchor:number[]) => {
    function rotateCoordinate(coordinate:Coordinate, angle:number, anchor:number[]) {
      var coord = rotate(
        [coordinate[0] - anchor[0], coordinate[1] - anchor[1]],
        angle
      );
      return [coord[0] + anchor[0], coord[1] + anchor[1]];
    }

    function rotateTransform(coordinate:Coordinate) {
      return rotateCoordinate(coordinate, angle, anchor);
    }
    var normalProjection = get(projection);

    var rotatedProjection:any = new Projection({
      code:
        normalProjection.getCode() +
        ":" +
        angle.toString() +
        ":" +
        extent.toString(),
      units: normalProjection.getUnits(),
      extent: extent,
    });
    addProjection(rotatedProjection);

   addCoordinateTransforms(
      "EPSG:3857",
      rotatedProjection,
      function (coordinate:any) {
        const rotate=rotateTransform(
          transform(coordinate, "EPSG:3857", projection)
        );
        const re:ol.Coordinate=[rotate[0],rotate[1]];
        return re;
      },
      function(){
        const re:ol.Coordinate=[0,0];
        return re;
      }
    );

    return rotatedProjection;
  };

  const imageSource = new Static({
    url: imgUrl,
    imageExtent: extent,
    crossOrigin: "",
    projection: rotateProjection((Math.PI / 180) * -angle, coord[3]),
  });

  const sceneImageMeta = {
    sceneId: "wv3ps_201120_14431_56981_01_01_22_fs",
    projection:
      'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["EPSG","4326"]]',
    extent: {
      pointList: [
        { x: -118.44102960000002, y: 33.961017600000005 },
        { x: -118.38204720001693, y: 33.961017600000005 },
        { x: -118.38204720001693, y: 33.924844800010376 },
        { x: -118.44102960000002, y: 33.924844800010376 },
        { x: -118.44102960000002, y: 33.961017600000005 },
      ],
    },
    geoTransformList: [
      -118.44102960000002,
      0.0000035999999989677496,
      0,
      33.961017600000005,
      0,
      -0.0000035999999989677496,
    ],
    widthList: [
      0,
      0,
      0,
      0,
      1,
      2,
      3,
      5,
      11,
      22,
      43,
      86,
      172,
      344,
      688,
      1375,
      2749,
      5498,
      10995,
      21990,
      16384,
    ],
    heightList: [
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      4,
      8,
      16,
      32,
      64,
      128,
      255,
      509,
      1017,
      2033,
      4065,
      8129,
      16257,
      10048,
    ],
    minPixelList: [11, 11, 10],
    maxPixelList: [2047, 2047, 2047],
    min2percentPixelList: [220, 122, 56],
    max2percentPixelList: [2047, 2047, 2047],
  };
  const wo2Percent = getMinMaxWo2Percent(sceneImageMeta);

  const loadImageData = () => {
    axios
      .post(
        "http://115.71.37.13:33080/com.sia.obision.scene.image.SceneImageRouter/getSceneImageTileV1",
        { sceneId: sceneImageMeta.sceneId, x: 0, y: 0, z: 15 }
      )
      .then(function (response) {
        const imgPb = response.data.image;
        const img = rawImagePb2Image(imgPb, sceneImageMeta);
        const imgData = adjustImage(img, 0, 0, wo2Percent.min, wo2Percent.max);
        const canvas = document.createElement("canvas");
        canvas.className = "canvas";
        canvas.width = imgData.width;
        canvas.height = imgData.height;
        const ctx:any = canvas.getContext("2d");
        ctx.putImageData(imgData, 0, 0);
        setImgUrl(canvas.toDataURL());
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (imgUrl) return;
    loadImageData();
  }, []);






  var map = new Map({
    layers: [
      new TileLayer({
        source: new OSM()
      }),
      new ImageLayer({
        source: imageSource
      })
    ],
    target: "map",
    view: new View({
      center: getCenter(extent),
      zoom: 4
    })
  })


  
  return (
    <div id="map" className="map">
    </div>
  );
};

export default Image;
