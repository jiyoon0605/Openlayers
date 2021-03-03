// import "./PointOp"

export class Point {
  private _x: number
  get x(): number {
    return this._x
  }
  private _y: number
  get y(): number {
    return this._y
  }

  constructor(x: number = 0, y: number = 0) {
    this._x = x
    this._y = y
  }

  public move(xInc: number = 0, yInc: number = 0): void {
    this._x += xInc
    this._y += yInc
  }

  public distanceFrom(p: Point): number {
    return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2))
  }

  public distanceFromOrigin(): number {
    return this.distanceFrom(new Point(0, 0))
  }

  public rotate(reference: Point, angleRad: number): void {
    const rx = (this.x - reference.x) * Math.cos(angleRad) - (this.y - reference.y) * Math.sin(angleRad) + reference.x
    const ry = (this.x - reference.x) * Math.sin(angleRad) + (this.y - reference.y) * Math.cos(angleRad) + reference.y
    this._x = rx
    this._y = ry
  }

  static midPointOf(p1: Point, p2: Point): Point {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
  }
}

export default Point
