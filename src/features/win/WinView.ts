import { Assets, Sprite, Texture } from "pixi.js";
import { GridView } from "../../modules/Grid/GridView";
import { IWinData } from "./Win";
import { delay, easeInQuad, lerp } from "../../utils/utils";
import { Animator } from "../../utils/Animator";
import { Grid, IGridPosition } from "../../modules/Grid/Grid";
import { Symbol } from "../../modules/Grid/Symbol";
import { WinLabelView } from "./WinLabelView";

const WIN_OVERLAY_ASSETS = [
  'A_connect.png',
  '9_connect.png',
  '10_connect.png',
  'J_connect.png',
  'K_connect.png',
  'H1_connect.png',
  'H2_connect.png',
  'H3_connect.png',
  'H5_connect.png',
];

export class WinView {
  private _textures = new Map<number, Texture>();
  private _gridView: GridView;
  private _winLabel: WinLabelView;

  constructor(private _grid: Grid) {
    this._gridView = _grid.view;
    this._winLabel = new WinLabelView(_grid.view);
  }

  public async init() {
    for (const [index, assetName] of WIN_OVERLAY_ASSETS.entries()) {
      const texture = await Assets.load(`${assetName}`);
      this._textures.set(index, texture);
    }
  }

  public async showWin(data: IWinData) {
    const overlays: Sprite[] = [];
    const animations: Promise<void>[] = []

    for (const position of data.positions) {
      const overlay = this.createOverlay(data.id);
      overlay.position = this._gridView.getSymbolPosition(position.reel, position.row);
      overlays.push(overlay);
      animations.push(this.playWinAnimation(overlay));
    }
    this._gridView.addChild(...overlays);

    this.fadeNoWinSymbols(data.positions, 0x888888);
    this._winLabel.showWin(data);

    await Promise.all(animations);

    this._winLabel.hide();
    this.fadeNoWinSymbols([], 0xFFFFFF);

    overlays.forEach(overlay => this._gridView.removeChild(overlay).destroy());
  }

  private createOverlay(id: number) {
    const texture = this._textures.get(id);
    return new Sprite(texture);
  }

  private async playWinAnimation(overlay: Sprite) {
    overlay.alpha = 0;
    await this.createFadeAnimation(overlay, 1, 400).start();
    await delay(300);
    await this.createFadeAnimation(overlay, 0, 400).start();
  }

  private createFadeAnimation(overlay: Sprite, targetAlpha: number, duration: number) {
    const startAlpha = overlay.alpha;
    const fadeAnimation = (t: number) => {
      const progress = easeInQuad(t);
      overlay.alpha = lerp(startAlpha, targetAlpha, progress);
    };

    return new Animator(0, duration, fadeAnimation);
  }

  public fadeNoWinSymbols(positions: IGridPosition[], value: number) {
    const symbols = this._grid.symbols.flat();
    const isWinSymbol = (symbol: Symbol) => positions.some(position => position.reel == symbol.reel && position.row == symbol.row);
    const noWinSymbols = symbols.filter(symbol => symbol && !isWinSymbol(symbol)) as Symbol[];

    noWinSymbols.forEach(symbol => symbol.tint = value);
  }
  
}
