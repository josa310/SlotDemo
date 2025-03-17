import { Container } from "pixi.js";
import { GridView } from "../Grid/GridView";
import { UIView } from "../UI/view/UIView";

export class GameView extends Container {

  constructor(private _rootContainer: Container) {
    super();
    this._rootContainer.addChild(this);
  }

  public set gridView(value: GridView) { this.addChild(value); }
  public set uiView(value: UIView) { this.addChild(value); }
}