import CoordinatesTransform from "./image/CoordinatesTransform";
import Point from "./geo/Point";
import Image from './image/Image'
import Pixel from "./image/Pixel";

export type Polygon = {
    pointList: Array<{
        x: number,
        y: number,
    }>,
}

export type SceneImageMetaV1 = {
    sceneId: string,
    projection: string,
    extent: Polygon,
    geoTransformList: Array<number>,
    widthList: Array<number>,
    heightList: Array<number>,
    minPixelList: Array<number>,
    maxPixelList: Array<number>,
    min2percentPixelList: Array<number>,
    max2percentPixelList: Array<number>,
}

export type TMRImageV1 = {
    width: number,
    height: number,
    min: Array<number>,
    max: Array<number>,
    r: Array<number>,
    g: Array<number>,
    b: Array<number>,
    a: Array<number>,
}

export const rawImagePb2Image = (imagePb: TMRImageV1, sceneTileMeta: SceneImageMetaV1) => {
    return new Image(
        imagePb.r,
        imagePb.g,
        imagePb.b,
        imagePb.a,
        imagePb.width,
        imagePb.height,
        new CoordinatesTransform(sceneTileMeta.geoTransformList, sceneTileMeta.projection),
    )
}

export function adjustImage(image: Image, brightness: number, contrast: number, min: Pixel, max: Pixel): ImageData {
    const imageData = new ImageData(image.width, image.height)
    const is8bitImage = (max.r | max.g | max.b) <= 255
    for (let i = 0, len = image.width * image.height; i < len; i++) {
        const { r, g, b } = is8bitImage
            ? image.getPixel(i).adjustPixel(brightness, contrast, 0, 255)
            : image.getPixel(i).changeRange(min, max, 0, 255).adjustPixel(brightness, contrast, 0, 255)
        imageData.data[i * 4] = r
        imageData.data[i * 4 + 1] = g
        imageData.data[i * 4 + 2] = b
        imageData.data[i * 4 + 3] = 255
    }
    return imageData
}

export const computeNwSeLatLng = (meta: SceneImageMetaV1) => {
    const ct = new CoordinatesTransform(meta.geoTransformList, meta.projection)
    const nwPoint = ct.pixelCoordsToWgs84(new Point(0, 0))
    const originalSceneWidth = meta.widthList[20]
    const originalSceneHeight = meta.heightList[20]
    const sePoint = ct.pixelCoordsToWgs84(new Point(originalSceneWidth, originalSceneHeight))
    return {
        nwLatLng: { lat: nwPoint.y, lng: nwPoint.x },
        seLatLng: { lat: sePoint.y, lng: sePoint.x },
    }
}

export const getMinMaxWo2Percent = (meta: SceneImageMetaV1) => {
    const minWo2Percent = new Pixel(
        meta.min2percentPixelList[0] as number,
        meta.min2percentPixelList[1] as number,
        meta.min2percentPixelList[2] as number,
    )
    const maxWo2Percent = new Pixel(
        meta.max2percentPixelList[0] as number,
        meta.max2percentPixelList[1] as number,
        meta.max2percentPixelList[2] as number,
    )
    return { min: minWo2Percent, max: maxWo2Percent }
}
