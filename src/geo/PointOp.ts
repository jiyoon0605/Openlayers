import { Point } from "./Point"

declare module "./Point" {
  export interface Point {
    add(other: Point): Point
    subtract(other: Point): Point
    multiply(other: Point): Point
    multiplyValue(value: number): Point
    divideValue(value: number): Point
  }
}

Point.prototype.add = function(other: Point): Point {
  return new Point(this.x + other.x, this.y + other.y)
}

Point.prototype.subtract = function(other: Point): Point {
  return new Point(this.x - other.x, this.y - other.y)
}

Point.prototype.multiplyValue = function(value: number): Point {
  return new Point(this.x * value, this.y * value)
}

Point.prototype.divideValue = function(value: number): Point {
  return new Point(this.x / value, this.y / value)
}
