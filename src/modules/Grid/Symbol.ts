import { Assets, Container, Sprite } from "pixi.js";

const SYMBOL_ASSETS = [
  'A.png',
  '9.png',
  '10.png',
  'J.png',
  'K.png',
  'H1.png',
  'H2.png',
  'H3.png',
  'H5.png',
  'BONUS.png',
];

export class Symbol extends Container {
  private _sprite: Sprite;
  private _reel: number;
  private _row: number;

  public get row() { return this._row; }
  public set row(value: number) { this._row = value; }
  
  public get reel() { return this._reel; }
  public set reel(value: number) { this._reel = value; }
  
  public get id() { return this._id; }
  public set id(value: number) { this._id = value; }

  public get sprite() { return this._sprite; }

  constructor(private _id: number) {
    super();
    this.setSprite();
  }

  private async setSprite() {
    const assetName = SYMBOL_ASSETS[this._id];
    const texture = await Assets.load(`${assetName}`);
    this._sprite = new Sprite(texture);
    this.addChild(this._sprite);
  }
}