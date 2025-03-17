import { Container, Graphics, Text, TextOptions } from "pixi.js";

export class FreespinCounter extends Container {
  private _background: Graphics;
  private _text: Text;

  constructor() {
    super();

    this.createBackground();
    this.createText();

    this.visible = false;
    this.position.set(550, -650);
  }

  public setCount(currentFS: number, totalFS: number) {
    this._text.text = `Free Spins: ${currentFS} / ${totalFS}`;
  }

  private createBackground() {
    this._background = new Graphics();
    this._background.roundRect(-350, -40, 700, 80, 10);
    this._background.fill({ color: 0x222222, alpha: 0.7 });
    this._background.stroke({ color: 0xFFFFFF, width: 3 });

    this.addChild(this._background);
  }

  private createText() {
    const options: TextOptions = {
      anchor: 0.5,
      style: {
        fontWeight: 'bold',
        fill: 0xFFFFFF,
        fontSize: 50,
        align: 'center',
      }
    };
    this._text = this.addChild(new Text(options));
  }
}