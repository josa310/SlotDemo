import { Container, FederatedEventHandler, Graphics } from "pixi.js";
import { SpinButton } from "./SpinButton";
import { TotalWinCounter } from "./TotalWinCounter";
import { FreespinCounter } from "./FreespinCounter";

export class UIView extends Container {
  private _spinButton: SpinButton;
  private _menuGraphics: Graphics;
  private _winCounter: TotalWinCounter;
  private _freespinCounter: FreespinCounter;

  public set winAmount(value: string) { this._winCounter.winAmount = value; }
  public get freeSpinCounter() { return this._freespinCounter; }

  public init() {
    this.createMenu();
    this.createSpinButton();
    this.createWinCounter();
    this.createFreespinCounter();
    this.position.set(250, 730);
  }

  public initSpinButton(listener: FederatedEventHandler) {
    this._spinButton.enabled = true;
    this._spinButton.onClick = listener;
  }

  public enableSpinButton(value: boolean) {
    this._spinButton.enabled = value;
  }

  private createSpinButton() {
    this._spinButton = new SpinButton();
    this.addChild(this._spinButton);
  }

  private createMenu() {
    this._menuGraphics = new Graphics();
    this._menuGraphics.roundRect(0, 0, 1100, 100, 10);
    this._menuGraphics.fill(0x222222);

    this.addChild(this._menuGraphics);
  }

  private createWinCounter() {
    this._winCounter = new TotalWinCounter();
    this.addChild(this._winCounter);
  }

  private createFreespinCounter() {
    this._freespinCounter = new FreespinCounter();
    this.addChild(this._freespinCounter);
  }
}