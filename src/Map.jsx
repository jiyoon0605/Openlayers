import React from "react";
import axios from "axios";

import {adjustImage, getMinMaxWo2Percent, rawImagePb2Image} from "./util";

const sceneImageMeta = {
    sceneId: "wv3ps_201120_14431_56981_01_01_22_fs",
    projection: 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433],AUTHORITY["EPSG","4326"]]',
    extent: {
        pointList: [
            {x: -118.44102960000002, y: 33.961017600000005},
            {x: -118.38204720001693, y: 33.961017600000005},
            {x: -118.38204720001693, y: 33.924844800010376},
            {x: -118.44102960000002, y: 33.924844800010376},
            {x: -118.44102960000002, y: 33.961017600000005},
        ],
    },
    geoTransformList: [-118.44102960000002, 0.0000035999999989677496, 0, 33.961017600000005, 0, -0.0000035999999989677496],
    widthList: [0, 0, 0, 0, 1, 2, 3, 5, 11, 22, 43, 86, 172, 344, 688, 1375, 2749, 5498, 10995, 21990, 16384],
    heightList: [0, 0, 0, 0, 1, 1, 2, 4, 8, 16, 32, 64, 128, 255, 509, 1017, 2033, 4065, 8129, 16257, 10048],
    minPixelList: [11, 11, 10],
    maxPixelList: [2047, 2047, 2047],
    min2percentPixelList: [220, 122, 56],
    max2percentPixelList: [2047, 2047, 2047],
}
const wo2Percent = getMinMaxWo2Percent(sceneImageMeta)

export default function Map() {
    const canvasRef = React.useRef(null)

    const onClick = () => {
        axios.post('http://115.71.37.13:33080/com.sia.obision.scene.image.SceneImageRouter/getSceneImageTileV1',
            { sceneId: sceneImageMeta.sceneId, x:0, y:0, z:15 },
        )
            .then(function (response) {
                const imgPb = response.data.image
                const img = rawImagePb2Image(imgPb, sceneImageMeta)
                const imgData = adjustImage(img, 0, 0, wo2Percent.min, wo2Percent.max)
                const ctx = canvasRef.current.getContext("2d")
                ctx.putImageData(imgData, 0, 0)
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    return (
        <>
            <button onClick={onClick}>{"draw image"}</button>
            <canvas ref={canvasRef} width={"600px"} height={"600px"}/>
        </>
    );
}
