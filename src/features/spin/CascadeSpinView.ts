import { PointData } from "pixi.js";
import { Symbol } from "../../modules/Grid/Symbol";
import { Animator } from "../../utils/Animator";
import { easeInQuint, lerpPoint } from "../../utils/utils";
import { Grid } from "../../modules/Grid/Grid";
import { GridView } from "../../modules/Grid/GridView";

export class CascadeSpinView {
  private readonly DURATION = 600;
  private readonly REEL_DELAY = 50;
  private readonly ROW_DELAY = 30;
  
  private _grid: Grid;
  private _gridView: GridView;

  constructor(grid: Grid) {
    this._grid = grid;
    this._gridView = grid.view;
  }

  public async dropOutSymbol(symbol: Symbol) {
    this._gridView.popSymbol(symbol.reel, symbol.row);
    this._gridView.addChild(symbol);

    const from = symbol.position;
    const to = { x: from.x, y: from.y + this._gridView.gridHeight * 1.1};
    await this.dropSymbol(from, to, symbol);
    symbol.destroy();
  }

  public async dropInSymbol(id, reel: number, row: number) {
    const symbol = this.createSymbol(id, reel, row);
    this._grid.replaceSymbol(symbol);

    const to = this._gridView.getSymbolPosition(reel, row);
    const from = { x: to.x, y: to.y - this._grid.view.gridHeight * 1.1 };
    symbol.position.set(from.x, from.y);

    await this.dropSymbol(from, to, symbol);
  }


  private async dropSymbol(from: PointData, to: PointData, symbol: Symbol) {
    const reelDelay = this.REEL_DELAY * symbol.reel;
    const rowDelay = this.ROW_DELAY * (this._grid.config.rowCount - symbol.row - 1);

    const animator = new Animator(
      reelDelay + rowDelay,
      this.DURATION,
      dropAnimFactory(from, to, symbol),
    );
    await animator.start();
  }

  public createSymbol(id: number, reel: number, row: number): Symbol {
    const symbol = new Symbol(id);
    symbol.reel = reel;
    symbol.row = row;

    return symbol;
  }
}

function dropAnimFactory(from: PointData, to: PointData, symbol: Symbol) {
  return async (delta: number) => {
    const progress = easeInQuint(delta);
    symbol.position = lerpPoint(from, to, progress);
  };
}