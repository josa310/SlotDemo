import { Container, Text, TextOptions } from "pixi.js";

export class TotalWinCounter extends Container {
  private _text: Text;

  public set winAmount(value: string) { 
    const prefix = value ? 'WIN: ' : '';
    this._text.text = prefix + value; 
  }

  constructor() {
    super();

    this.createWinText();
  }

  private createWinText() {
    const options: TextOptions = {
      x: 550,
      y: 50,
      anchor: 0.5,
      style: {
        fontWeight: 'bold',
        fill: 0xFFFFFF,
        fontSize: 80,
        align: 'center',
      }
    };
    this._text = this.addChild(new Text(options));
  }
}