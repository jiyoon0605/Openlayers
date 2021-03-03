import CoordinatesTransform from "./CoordinatesTransform"
import Pixel from "./Pixel"

export class Image {
  private readonly r: number[]
  private readonly g: number[]
  private readonly b: number[]
  private readonly a: number[]
  public readonly width: number
  public readonly height: number
  public readonly transform: CoordinatesTransform

  get gsd(): number {
    return this.transform.gsd
  }

  private _min: Pixel | undefined
  get min(): Pixel {
    if (this._min) {
      return this._min
    } else {
      const rMin = this.r.reduce((prev, cur) => (prev < cur ? prev : cur))
      const gMin = this.g.reduce((prev, cur) => (prev < cur ? prev : cur))
      const bMin = this.b.reduce((prev, cur) => (prev < cur ? prev : cur))
      this._min = new Pixel(rMin, gMin, bMin)
      return this._min
    }
  }
  private _max: Pixel | undefined
  get max(): Pixel {
    if (this._max) {
      return this._max
    } else {
      const rMax = this.r.reduce((prev, cur) => (prev > cur ? prev : cur))
      const gMax = this.g.reduce((prev, cur) => (prev > cur ? prev : cur))
      const bMax = this.b.reduce((prev, cur) => (prev > cur ? prev : cur))
      this._max = new Pixel(rMax, gMax, bMax)
      return this._max
    }
  }

  private _maxWo2p: Pixel | undefined
  get maxWo2percent(): Pixel {
    if (this._maxWo2p) {
      return this._maxWo2p
    } else {
      const { min, max } = this.getMinMaxWithout2Percent()
      this._minWo2p = min
      this._maxWo2p = max
      return this._maxWo2p
    }
  }
  private _minWo2p: Pixel | undefined
  get minWo2percent(): Pixel {
    if (this._minWo2p) {
      return this._minWo2p
    } else {
      const { min, max } = this.getMinMaxWithout2Percent()
      this._minWo2p = min
      this._maxWo2p = max
      return this._minWo2p
    }
  }

  constructor(
    r: number[] = [],
    g: number[] = [],
    b: number[] = [],
    a: number[] = [],
    width: number = 0,
    height: number = 0,
    transform: CoordinatesTransform,
  ) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
    this.width = width
    this.height = height
    this.transform = transform
  }

  private getMinMaxWithout2Percent(): { min: Pixel; max: Pixel } {
    const rMinMax = this.computedMinMaxWithout2Percent(this.r)
    const gMinMax = this.computedMinMaxWithout2Percent(this.g)
    const bMinMax = this.computedMinMaxWithout2Percent(this.b)

    return {
      min: new Pixel(rMinMax.min, gMinMax.min, bMinMax.min),
      max: new Pixel(rMinMax.max, gMinMax.max, bMinMax.max),
    }
  }

  private computedMinMaxWithout2Percent(pixels: number[]) {
    const sortedNumbers = [...pixels].sort((a, b) => a - b)
    const newPixels = sortedNumbers.filter((num) => num > 10)
    const count2Percent = Math.floor(newPixels.length * 0.02)

    return { min: newPixels[count2Percent], max: newPixels[newPixels.length - 1 - count2Percent] }
  }

  public getPixel(index: number): Pixel {
    return new Pixel(this.r[index], this.g[index], this.b[index], this.a[index])
  }

  public getSampledImage(stepSize: number): Image {
    const pixels: { r: number[]; g: number[]; b: number[]; a: number[] } = { r: [], g: [], b: [], a: [] }
    for (let y = 0; y < this.height; y += stepSize) {
      for (let x = 0; x < this.width; x += stepSize) {
        const index = y * this.width + x
        pixels.r.push(this.r[index])
        pixels.g.push(this.g[index])
        pixels.b.push(this.b[index])
        pixels.a.push(this.a[index])
      }
    }
    return new Image(
      pixels.r,
      pixels.g,
      pixels.b,
      pixels.a,
      Math.ceil(this.width / stepSize),
      Math.ceil(this.height / stepSize),
      this.transform,
    )
  }
}

export default Image
