import { Ticker } from "pixi.js";
import { delay } from "./utils";

export class Animator {
  private elapsed = 0;
  private ticker = Ticker.shared;
  private resolve: (value: unknown) => void;

  constructor(
    private delay: number,
    private duration: number,
    private onUpdate: (delta: number) => void,
  ) {}

  public async start() {
    this.elapsed = 0;
    await delay(this.delay);
    
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.ticker.add(this.update);
    });
  }

  private update = (ticker: Ticker) => {
    this.elapsed += ticker.deltaMS;

    if (this.duration < this.elapsed) {
      this.ticker.remove(this.update);
      this.resolve(null);
    }

    this.onUpdate(Math.min(this.elapsed / this.duration, 1));
  }
}