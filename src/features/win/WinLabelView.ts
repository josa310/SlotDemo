import { Container, Graphics, Text, TextOptions } from "pixi.js";
import { GridView } from "../../modules/Grid/GridView";
import { IWinData } from "./Win";
import { IGridPosition } from "../../modules/Grid/Grid";

export class WinLabelView {
  private _winLabel = new WinLabel();

  constructor(private _gridView: GridView) {}

  public showWin(data: IWinData) {
    this._winLabel.text = `${data.winAmount}`;
    this._winLabel.position = this.findCenter(data.positions);

    this._gridView.addChild(this._winLabel);
  }

  public hide() {
    this._gridView.removeChild(this._winLabel);
  }

  private findCenter(positions: IGridPosition[]) {
    const min = { x: Infinity, y: Infinity };
    const max = { x: -Infinity, y: -Infinity };
    positions.forEach(({ reel, row }) => {
      min.x = Math.min(min.x, reel);
      min.y = Math.min(min.y, row);
      max.x = Math.max(max.x, reel);
      max.y = Math.max(max.y, row);
    });

    const center = {
      x: (min.x + max.x) / 2 + 0.5,
      y: (min.y + max.y) / 2 + 0.5,
    };

    return this._gridView.getSymbolPosition(center.x, center.y);
  }
}

class WinLabel extends Container {
  private _label: Text;
  private _background: Graphics;

  public set text(value: string) { this._label.text = value; }

  constructor() {
    super();
    this.createBackground();
    this.createLabel();
  }

  private createBackground() {
    this._background = this.addChild(new Graphics());
    this._background.roundRect(-150, -60, 300, 120, 10);
    this._background.stroke({color: 0xFFFFFF, width: 5});
    this._background.fill({color: 0x000000, alpha: 0.7});
  }

  private createLabel() {
    const options: TextOptions = {
      anchor: 0.5,
      style: {
        fontWeight: 'bold',
        fill: 0xFFFFFF,
        fontSize: 80,
        align: 'center',
      }
    };
    this._label = this.addChild(new Text(options));
  }
}