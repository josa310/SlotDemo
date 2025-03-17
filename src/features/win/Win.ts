import { Grid, IGridPosition } from "../../modules/Grid/Grid";
import { ModuleId } from "../../modules/ModulHandler";
import { UI } from "../../modules/UI/UI";
import { ServiceLocator } from "../../serviceLocator/ServiceLocator";
import { FeatureId, IFeature } from "../FeatureHandler";
import { WinView } from "./WinView";

export interface IWinData {
  id: number;
  positions: IGridPosition[];
  winAmount: number;
}

export class WinFeature implements IFeature {
  public readonly id = FeatureId.WIN;
  private _totalWin = 0;

  private _view: WinView;
  private _ui: UI;

  public async init() {
    const moduleHandler = ServiceLocator.moduleHandler;

    this._ui = moduleHandler.getModule<UI>(ModuleId.UI);
    const grid = moduleHandler.getModule<Grid>(ModuleId.GRID);
    this._view = new WinView(grid);
    
    await this._view.init();
  }

  public ready() {}

  public async process(wins: IWinData[]) {
    for (const winData of wins) {
      this._totalWin += winData.winAmount
      this._ui.setWinAmount(this._totalWin.toString());

      await this._view.showWin(winData);
    }
  }

  public clear() {
    this._totalWin = 0;
    this._ui.clearWinAmount();
  }
}