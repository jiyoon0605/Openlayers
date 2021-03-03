import Point from "./Point"
import { Shape } from "./Shape"

export class Rectangle implements Shape {
  private readonly _points: Point[]
  private _midPoints: Point[] = []
  private _width: number
  private _height: number

  constructor(topLeft: Point, bottomRight: Point) {
    this._points = [topLeft, new Point(topLeft.x, bottomRight.y), bottomRight, new Point(bottomRight.x, topLeft.y)]
    this.updateMidPoint()
    this._width = Math.abs(Math.round((bottomRight.x - topLeft.x) * 1e12) / 1e12)
    this._height = Math.abs(Math.round((bottomRight.y - topLeft.y) * 1e12) / 1e12)
  }

  get points(): Point[] {
    return this._points
  }

  get midPoints(): Point[] {
    return this._midPoints
  }

  get leftX(): number {
    const left = this._points.reduce(function(min, p) {
      return min.x > p.x ? p : min
    })
    return left.x
  }
  get rightX(): number {
    const right = this._points.reduce(function(max, p) {
      return max.x > p.x ? max : p
    })
    return right.x
  }

  get topY(): number {
    const top = this._points.reduce(function(min, p) {
      return min.y > p.y ? p : min
    })
    return top.y
  }

  get bottomY(): number {
    const bottom = this._points.reduce(function(max, p) {
      return max.y > p.y ? max : p
    })
    return bottom.y
  }

  get center(): Point {
    const centerX = (this.leftX + this.rightX) / 2
    const centerY = (this.topY + this.bottomY) / 2
    return new Point(centerX, centerY)
  }

  get width(): number {
    return this._width
  }

  get height(): number {
    return this._height
  }

  move(x: number, y: number): void {
    for (const p of this._points) {
      p.move(x, y)
    }
    for (const p of this.midPoints) {
      p.move(x, y)
    }
  }

  public updateMidPoint(): void {
    for (let i = 0; i < this._points.length; ++i) {
      this._midPoints[i] = Point.midPointOf(this._points[i], this._points[(i + 1) % this._points.length])
    }
  }

  public updateWidthHeight() {
    this._width = Math.abs(Math.round(this.points[1].distanceFrom(this.points[2]) * 1e12) / 1e12)
    this._height = Math.abs(Math.round(this.points[0].distanceFrom(this.points[1]) * 1e12) / 1e12)
  }

  rotate(reference: Point, angleRad: number): void {
    for (const p of this._points) {
      p.rotate(reference, angleRad)
    }
    for (const p of this.midPoints) {
      p.rotate(reference, angleRad)
    }
  }
}
