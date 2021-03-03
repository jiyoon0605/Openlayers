export class Pixel {
  private _r: number
  get r() {
    return this._r
  }
  private _g: number
  get g() {
    return this._g
  }
  private _b: number
  get b() {
    return this._b
  }
  private _a: number | undefined
  get a() {
    return this._a
  }

  constructor(r: number, g: number, b: number, a?: number) {
    this._r = r
    this._g = g
    this._b = b
    this._a = a
  }

  public changeRange(minFrom: Pixel, maxFrom: Pixel, minTo: number, maxTo: number): Pixel {
    this._r = this.changeValueRange(this._r, minFrom.r, maxFrom.r, minTo, maxTo)
    this._g = this.changeValueRange(this._g, minFrom.g, maxFrom.g, minTo, maxTo)
    this._b = this.changeValueRange(this._b, minFrom.b, maxFrom.b, minTo, maxTo)
    return this
  }

  private changeValueRange(value: number, minFrom: number, maxFrom: number, minTo: number, maxTo: number) {
    const cutValue = this.cutOff(value, minFrom, maxFrom)
    return ((cutValue - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo
  }

  private cutOff(value: number, min: number, max: number) {
    if (value < min) {
      return min
    } else if (value > max) {
      return max
    } else {
      return value
    }
  }

  public adjustPixel(brightness: number, contrast: number, min: number, max: number): Pixel {
    if (brightness === 0 && contrast === 0) return this

    const delta = (Math.floor((max - min) / 2) * contrast) / 100
    const a = max / (max - delta * 2)
    const b = a * (brightness - delta)
    this._r = this.cutOff(a * this._r + b, min, max)
    this._g = this.cutOff(a * this._g + b, min, max)
    this._b = this.cutOff(a * this._b + b, min, max)
    return this
  }
}

export default Pixel
