import proj4 from "proj4"

import Point from "../geo/Point"

const TOP_LEFT_X_INDEX = 0
const PIXEL_X_SIZE_INDEX = 1
const TOP_LEFT_Y_INDEX = 3
const PIXEL_Y_SIZE_INDEX = 5

export class CoordinatesTransform {
  private readonly geoTransform: number[]
  private readonly projection: string
  public get gsd() {
    return this.geoTransform[PIXEL_X_SIZE_INDEX]
  }

  constructor(geoTransform: number[], projection: string) {
    this.geoTransform = geoTransform
    this.projection = projection
  }

  public pixelCoordsToImgCoords(p: Point): Point {
    const topLeftXForImgCoords = Number(this.geoTransform[TOP_LEFT_X_INDEX])
    const topLeftYForImgCoords = Number(this.geoTransform[TOP_LEFT_Y_INDEX])

    const gsdX = Number(this.geoTransform[PIXEL_X_SIZE_INDEX])
    const gsdY = Number(this.geoTransform[PIXEL_Y_SIZE_INDEX])

    const xForImgCoords = topLeftXForImgCoords + p.x * gsdX
    const yForImgCoords = topLeftYForImgCoords + p.y * gsdY

    return new Point(xForImgCoords, yForImgCoords)
  }

  public imgCoordsToWgs84(p: Point): Point {
    const wgs84 = proj4(this.projection, "EPSG:4326").forward([p.x, p.y])
    return new Point(wgs84[0], wgs84[1])
  }

  public pixelCoordsToWgs84(p: Point): Point {
    const imgCoords = this.pixelCoordsToImgCoords(p)
    return this.imgCoordsToWgs84(imgCoords)
  }

  public wgs84ToImgCoords(p: Point): Point {
    const imgCoords = proj4("EPSG:4326", this.projection).forward([p.x, p.y])
    return new Point(imgCoords[0], imgCoords[1])
  }

  public imgCoordsToPixelCoords(p: Point): Point {
    const topLeftXForImgCoords = this.geoTransform[TOP_LEFT_X_INDEX]
    const topLeftYForImgCoords = this.geoTransform[TOP_LEFT_Y_INDEX]

    const pixelX = (p.x - topLeftXForImgCoords) / this.geoTransform[PIXEL_X_SIZE_INDEX]
    const pixelY = -(topLeftYForImgCoords - p.y) / this.geoTransform[PIXEL_Y_SIZE_INDEX]
    return new Point(pixelX, pixelY)
  }

  public wgs84ToPixelCoords(p: Point): Point {
    const imgCoords = this.wgs84ToImgCoords(p)
    return this.imgCoordsToPixelCoords(imgCoords)
  }
}

export default CoordinatesTransform
