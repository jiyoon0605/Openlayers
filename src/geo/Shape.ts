import Point from "./Point"

export interface Shape {
  points: Point[]
  midPoints: Point[]
  leftX: number
  rightX: number
  topY: number
  bottomY: number
  center: Point
  width: number
  height: number

  move(x: number, y: number): void
  updateMidPoint(): void
  rotate(reference: Point, angleRad: number): void
  updateWidthHeight(): void
}
