import React, { useEffect } from "react";
import axios from "axios";
import { adjustImage, getMinMaxWo2Percent, rawImagePb2Image } from "./util";
import {Coordinate,rotate}from 'ol/coordinate'
import {fromLonLat,get,addProjection,addCoordinateTransforms,transform, fromUserCoordinate, toLonLat, useGeographic} from 'ol/proj'
import {Extent} from 'ol/extent'
import Projection from 'ol/proj/Projection';
import Static from "ol/source/ImageStatic";
import { Image as ImageLayer, Tile as TileLayer} from "ol/layer";
import XYZ from "ol/source/XYZ"
import Map from "ol/Map";
import View from "ol/View";
import LayerGroup from "ol/layer/Group";
import { Feature } from "ol";
import Polygon, { fromExtent } from "ol/geom/Polygon";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Stroke from "ol/style/Stroke";
import VectorLayer from "ol/layer/Vector";
import { coordinate } from "openlayers";
import { constants } from "buffer";


type ImageUrl={
  url:string,
  width:number,
  height:number
}
const Image =  () => {
 useGeographic()
  const coords:Coordinate[] = [
    [-118.44102960000002, 33.961017600000005],
    [-118.38204720001693, 33.961017600000005],
    [-118.38204720001693, 33.924844800010376],
    [-118.44102960000002, 33.924844800010376],
    [-118.44102960000002, 33.961017600000005],
  ];

  const extent:Extent = [coords[3][0], coords[3][1], coords[1][0], coords[1][1]];

  const features = [new Feature(new Polygon([coords]))];
  features[0].setStyle(
    new Style({
      stroke: new Stroke({
        color: "#003bed",
        width: 5,
      }),
    }),
  )
  
  const vectorSource=new VectorSource({
    features:features
  })
  
  var vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  const projection:any = new Projection({
    code: "EPSG:4326",
  });

  const rotateProjection = (angle:number, anchor:number[]) => {
    function rotateCoordinate(coordinate:Coordinate, angle:number, anchor:number[]) {
      const coord = rotate(
        [coordinate[0] - anchor[0], coordinate[1] - anchor[1]],
        angle
      );
      return [coord[0] + anchor[0], coord[1] + anchor[1]];
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
      "EPSG:4326",
      rotatedProjection,
      function (coordinate:any) {
        const rotate=rotateCoordinate(
          transform(coordinate, "EPSG:4326", "EPSG:4326"),
          angle,
          anchor
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

 
  let isPending=false;

  let abortController = new AbortController();


  const source=new XYZ
  (
    { 
      minZoom:3,
      maxZoom:19,
      tileUrlFunction
      :(coordinates)=>
      {
        return `/map/${coordinates[0]}/${coordinates[1]}/${coordinates[2]}`
      },
      tileLoadFunction
      :(imageTile:any, src)=>
      {
        isPending=true;
        fetch(src,{signal:abortController.signal})
        .then((res)=>{imageTile.getImage().src=res.url;isPending=false})
        .catch(()=>{imageTile.getImage().src="";isPending=true;})
      }
    }
  )

const tile:any= new TileLayer({ 
  source:source
})

let map:Map=new Map({
  layers:[tile],
  view: new View({
    center: [coords[0][0],coords[0][1]],
    zoom: 14,
    minZoom:3,
    maxZoom:19,
  }),
});

let zoom:any=Math.round((map.getView().getZoom())as number);
let cancelToken=axios.CancelToken.source();


map.on('moveend',()=>{

  let curZoom=Math.round((map.getView().getZoom())as number);

  const curExtent=(map.getView().calculateExtent(map.getSize()))
  const curPos=[
    ([curExtent[0],curExtent[3]]),
    ([curExtent[2],curExtent[3]]),
    ([curExtent[2],curExtent[1]]),
    ([curExtent[0],curExtent[1]]),]

  if (zoom!==curZoom) {
    if(isPending){
      abortController.abort();
      abortController = new AbortController();     
    }
    cancelToken.cancel();
    cancelToken=axios.CancelToken.source();
    zoom=curZoom; 
    map.getView().setZoom(zoom)
    loadImageData(zoom)
  }
}
)
map.on('click',(e)=>console.log(e.coordinate))

const getTiles=(w:number,h:number,imgUrl:ImageUrl,x:number,y:number)=>{

    const x2=((w*y)+x)%w;
    const y2=Math.floor(((w*y)+x)/w)

    const resolution:number=((map.getView().getResolution() as number)/2)

  const [width,height]=[(resolution/imgUrl.width),(resolution/imgUrl.height)]

    let imageExtent:Extent= [
      coords[0][0]+width*x2,
      coords[0][1]-width*(y2+1),
      coords[0][0]+width*(x2+1),
      coords[0][1]-width*y2
    ]

    if(w-1===x2&&h-1===y2){
      imageExtent= [
        coords[2][0]-width,
        coords[2][1],
        coords[2][0],
        coords[2][1]+height
      ]
    }
    else if(w-1===x2){
      imageExtent= [
        coords[1][0]-width,
        coords[1][1]-height*(y2+1),
        coords[1][0],
        coords[1][1]-height*y2
      ]
    }
    else if(h-1===y2){
      imageExtent=[
        coords[3][0]+width*x2,
        coords[3][1],
        coords[3][0]+width*(x2+1),
        coords[3][1]+height
      ]
    }

    const imageLayer= new ImageLayer({
      source: 
        new Static({
        url: imgUrl.url,
        imageExtent: imageExtent,
        projection: projection//rotateProjection((Math.PI / 180)*30, coords[3]),
      })
    })

    return imageLayer 
  }

const loadImageData = async(zoomLv:number=map.getView().getZoom()as number) => {

  const resolution:number=map.getView().getResolution() as number

  // const imgLayer=new ImageLayer({
  //   source:new Static({
  //     url:"https://i.stack.imgur.com/GgzNf.jpgs",
  //     imageExtent: [coords[0][0]+resolution/256, coords[0][1]-(resolution/256*2), coords[0][0]+(resolution/256*2), coords[0][1]-resolution/256],
  //     projection: rotateProjection((Math.PI / 180)*30, coords[3])
  //   })
  // })

  map.setLayerGroup(new LayerGroup({layers: [tile,vectorLayer]}));
  const x=Math.ceil(sceneImageMeta.widthList[zoomLv]/256) 
  const y=Math.ceil(sceneImageMeta.heightList[zoomLv]/256)
  if(zoomLv>12){
    for(let i=0;i<x;i++){
      for(let j=0;j<y;j++){   
        
        axios
        .post(
          "http://115.71.37.13:33080/com.sia.obision.scene.image.SceneImageRouter/getSceneImageTileV1",
          { 
            sceneId: sceneImageMeta.sceneId, x: i, y: j, z:zoomLv 
          },
          {
            cancelToken:cancelToken.token
          }
        )
        .then(async(response)=> {
          const imgPb = response.data.image;
          const img = rawImagePb2Image(imgPb, sceneImageMeta);
          const imgData = adjustImage(img, 0, 0, wo2Percent.min, wo2Percent.max);
          const canvas = document.createElement("canvas");
          canvas.className = "canvas";
          canvas.width = imgData.width;
          canvas.height = imgData.height;
          const ctx:any = canvas.getContext("2d");
          ctx.putImageData(imgData, 0, 0);
          const imgUrl={
            url:canvas.toDataURL(),
            width:response.data.image.width,
            height:response.data.image.height
            }    
          map.addLayer(getTiles(x,y,imgUrl,i,j))
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}
}

};

  useEffect(() => {
    map.setTarget("map")
    loadImageData();
  }, []);

  return(
    <>
        <div id="map" className="map"></div>
    </>

  )
};

export default Image;