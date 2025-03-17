import { Grid } from "../../modules/Grid/Grid";
import { ModuleId } from "../../modules/ModulHandler";
import { ServiceLocator } from "../../serviceLocator/ServiceLocator";
import { FeatureId, IFeature } from "../FeatureHandler";
import { CascadeSpinView } from "./CascadeSpinView";

export class CascadeSpinFeature implements IFeature {
  public readonly id = FeatureId.SPIN;

  private _grid: Grid;
  private _view: CascadeSpinView;

  public async init() {
    this._grid = ServiceLocator.moduleHandler.getModule(ModuleId.GRID);
  }

  public ready() {
    this._view = new CascadeSpinView(this._grid);
  }

  public async process(symbols: number[][]) {
    
    this.dropOutSymbols();
    await this.dropInSymbols(symbols);
  }

  private async dropInSymbols(symbols: number[][]) {
    const animations: Promise<void>[] = [];
    for (let reel = 0; reel < symbols.length; reel++) {
      for (let row = 0; row < symbols[reel].length; row++) {
        const animation = this._view.dropInSymbol(symbols[reel][row], reel, row);
        animations.push(animation);
      }
    }

    await Promise.all(animations);
  }

  private async dropOutSymbols() {
    const animations: Promise<void>[] = [];

    for (const reel of this._grid.symbols) {
      for (const symbol of reel) {
        animations.push(this._view.dropOutSymbol(symbol!));
      }
    }

    await Promise.all(animations);
  }
}



