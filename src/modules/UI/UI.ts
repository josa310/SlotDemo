import { Dispatcher } from "../../utils/Dispatcher";
import { IModule, ModuleId } from "../ModulHandler";
import { UIView } from "./view/UIView";

export enum UIEvent {
  SPIN,
}

export class UI extends Dispatcher implements IModule {
  
  public readonly id = ModuleId.UI;

  private _view = new UIView();

  public get view() { return this._view; }

  public async init() {
    this._view.init();

    this._view.initSpinButton(() => this.dispatchEvent(UIEvent.SPIN));
  }

  public ready(): void {}

  public enableSpinButton(value: boolean) {
    this._view.enableSpinButton(value);
  }

  public clearWinAmount() {
    this._view.winAmount = '';
  }

  public setWinAmount(value: string) {
    this._view.winAmount = value;
  }
}