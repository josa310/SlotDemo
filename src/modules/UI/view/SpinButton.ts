import { Assets, Container, FederatedEventHandler, Sprite } from "pixi.js";

export class SpinButton extends Container {
  private _sprite: Sprite;
  private _enabled: boolean;
  private _clickListener: FederatedEventHandler;

  public get enabled() { return this._enabled; }
  public set enabled(value: boolean) {
    this._enabled = value;
    this.tint = value ? 0xFFFFFF : 0x555555;
    this.interactive = value;
  }

  public set onClick(listener: FederatedEventHandler) {
    this._clickListener = listener;
    this.onclick = this._clickListener;
  }

  constructor() {
    super();
    
    this.interactive = true;
    this.cursor = "pointer";
    this.createSprite();
    this.createKeyboardListener();
  }

  private async createSprite() {
    const texture = await Assets.load("SpinButton.png");
    this._sprite = new Sprite(texture);
    this._sprite.anchor.set(0.5);
    this._sprite.position.set(1050, 50);
    this.addChild(this._sprite);
  }

  private createKeyboardListener() {
    document.addEventListener("keydown", (event) => {
      if (event.key == " " && this._enabled) {
        this._clickListener({} as any);
      }
    });
  }
}