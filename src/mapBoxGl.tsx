import MapGL from 'react-map-gl';
import React,{useState}from 'react'

const MapBox=()=>{
  
  const [viewport, setViewport] = useState({
    width: 1920,
    height:1080 ,
    latitude: 0,
    longitude: 0,
    zoom: 3
      });

  const style={
    version: 8,
    sources: {
      raster: {
          type: "raster",
          tiles: [
            "/map/{z}/{x}/{y}"
          ],
          tileSize: 256
      }
    },
    layers: [{
        id: "test",
        type: "raster",
        source: "raster",
        minzoom: 0,
        maxzoom: 22
    }]
    }
    
      return (<>
        <MapGL
          mapStyle={style}
          {...viewport}
          onViewportChange={(nextViewport:any) => setViewport(nextViewport)}
          mapboxApiUrl={""}
        />
        </>
      );
}
export default  MapBox;