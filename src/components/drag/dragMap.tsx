import React from "react";
import {
  layer,
  Map,
  Layers,
} from "react-openlayers";
import * as ol from "openlayers";
import Drag from './drag'

const source = new ol.source.Vector({wrapX: false});

const DragMap=()=>{

    return(
    <Map>
        <Layers>
            <layer.Tile source={new ol.source.OSM()}/>
        </Layers>
    <Drag source={source}/>
    </Map>
   
    )
}

export default DragMap