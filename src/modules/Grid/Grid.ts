import { ServiceLocator } from "../../serviceLocator/ServiceLocator";
import { Config } from "../Config";
import { IModule, ModuleId } from "../ModulHandler";
import { GridView } from "./GridView";
import { Symbol } from "./Symbol";

export interface IGridPosition {
  reel: number;
  row: number;
}

export class Grid implements IModule {
  public readonly id = ModuleId.GRID;

  private _config: Config;
  private _symbols: (Symbol | null)[][] = [];
  private _view = new GridView(this);

  public get symbols() { return this._symbols; }
  public get view() { return this._view; }
  public get config() { return this._config; }

  constructor() {}
  
  public async init() {
    const ModulHandler = ServiceLocator.moduleHandler;
    this._config = ModulHandler.getModule(ModuleId.CONFIG);
  }

  public ready() {
    this._view.init();
  }

  public replaceSymbol(symbol: Symbol) {
    this._view.replaceSymbol(symbol);
  }
}