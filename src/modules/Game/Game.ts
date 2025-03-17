import { Container } from "pixi.js";
import { ServiceLocator } from "../../serviceLocator/ServiceLocator";
import { IModule, ModuleId } from "../ModulHandler";
import { GameView } from "./GameView";
import { Grid } from "../Grid/Grid";
import { UI, UIEvent } from "../UI/UI";
import { RGS } from "../RGS/RGS";
import { FeatureHandler, FeatureId } from "../../features/FeatureHandler";
import { WinFeature } from "../../features/win/Win";

export class Game implements IModule {
  private _view: GameView;
  private _ui: UI;
  private _rgs: RGS;
  private _featureHandler: FeatureHandler;

  public get id(): number { return ModuleId.GAME; };

  constructor(private _rootContainer: Container) {
    this._view = new GameView(this._rootContainer);
  }

  public async init() {
    this.createFeatures();

    this._rgs = ServiceLocator.moduleHandler.getModule(ModuleId.RGS);
  }

  public ready() {
    const moduleHandler = ServiceLocator.moduleHandler;
    this._ui = moduleHandler.getModule<UI>(ModuleId.UI);

    this._view.gridView = moduleHandler.getModule<Grid>(ModuleId.GRID).view;
    this._view.uiView = this._ui.view;

    this._ui.addEventListener(UIEvent.SPIN, () => this.processSpin());
  }

  private createFeatures() {
    this._featureHandler = ServiceLocator.featureHandler;
  }

  private async processSpin() {
    const winFeature = this._featureHandler.getModule<WinFeature>(FeatureId.WIN);
    winFeature.clear();
    
    this._ui.enableSpinButton(false);
    const commands = this._rgs.spin();

    for (const command of commands) {
      const feature = this._featureHandler.getModule(command.type);
      if (!feature) continue;
      
      await feature.process(command.data);
    }

    this._ui.enableSpinButton(true);
  }
}