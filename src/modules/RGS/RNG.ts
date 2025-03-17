export class RNG {
  private _seed: number;

  public get seed() { return this._seed; }
  public set seed(value: number) { this._seed = value; }

  constructor(seed = Math.round(Math.random() * 4294967296)) {
    this._seed = seed;
  }

  private lcg(): number {
    this._seed = (this._seed * 1664525 + 1013904223) % 4294967296;
    return this._seed / 4294967296;
  }

  public getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.lcg() * (max - min)) + min;
  }
}