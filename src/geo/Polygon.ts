import Point from "./Point"
import { Shape } from "./Shape"

export class Polygon implements Shape {
  private _points: Point[] = []
  private _midPoints: Point[] = []
  private _width: number = 0
  private _height: number = 0
  get points(): Point[] {
    return this._points
  }
  get midPoints(): Point[] {
    return this._midPoints
  }
  get leftX(): number {
    throw new Error("Method not implemented.")
  }
  get rightX(): number {
    throw new Error("Method not implemented.")
  }
  get topY(): number {
    throw new Error("Method not implemented.")
  }
  get bottomY(): number {
    throw new Error("Method not implemented.")
  }
  get center(): Point {
    throw new Error("Method not implemented.")
  }
  get width(): number {
    throw new Error("Method not implemented.")
  }
  get height(): number {
    throw new Error("Method not implemented.")
  }

  move(x: number, y: number): void {
    throw new Error("Method not implemented.")
  }
  updateMidPoint(): void {
    throw new Error("Method not implemented")
  }
  rotate(reference: Point, angleRad: number): void {
    throw new Error("Method not implemented.")
  }

  updateWidthHeight() {
    this._width = Math.round(this.points[0].distanceFrom(this.points[1]))
    this._height = Math.round(this.points[1].distanceFrom(this.points[2]))
  }
}
