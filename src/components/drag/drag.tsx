import React,{useState,useEffect} from "react";
import {
  interaction,
  layer,
  Interactions,
  Map,
  Layers,
} from "react-openlayers";
import * as ol from "openlayers";
import { idText } from "typescript";

type Props={
  source:ol.source.Vector
} 

const Drag:React.FC<Props>=({source})=>{
const [interactionType,setInteractionType]=useState("Circle")
let start=0;
let end=0;

const drawstart =(e:any)=> {
  source.clear()
  console.log(e)
//.feature.getGeometry().getExtent()
}
const drawEnd=()=>{
  if(interactionType==="Circle"){
    return;
  }
  else{

  }
}
return(
    <>
    <select onChange={(e) =>setInteractionType(e.target.value)} value={interactionType}>
        <option value="Square">Square</option>
        <option value="Circle">Circle</option>
      </select>
        <Layers>
          <layer.Vector source={source}/>
        </Layers>
        <Interactions>
          <interaction.Draw
              onDrawstart={drawstart}
              source={interactionType!=="Circle"?null:source}
              type="Circle"
              geometryFunction={interactionType==="Circle"?null:ol.interaction.Draw.createBox()}/>
          </Interactions>
      </>
    )
}

export default Drag