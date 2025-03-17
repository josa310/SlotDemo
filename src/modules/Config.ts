import { IModule, ModuleId } from "./ModulHandler";

export interface IGridData {
  reelCount: number;
  rowCount: number;
}

export interface IPaytable {
  [key: string]: number[];
}

export interface IConfigData {
  grid: IGridData;
  symbols: number[];
  paytable: IPaytable;
  scatterID: number;
  freespinChance: number;
  freespinRange: number[];
}

export class Config implements IModule {
  public readonly id = ModuleId.CONFIG;

  private _data: IConfigData;

  public get data() { return this._data; }
  public get reelCount() { return this._data.grid.reelCount; }
  public get rowCount() { return this._data.grid.rowCount; }
  public get symbols() { return this._data.symbols; }
  public get paytable() { return this._data.paytable; }
  public get scatterID() { return this._data.scatterID; }
  public get freespinChance() { return this._data.freespinChance; }
  public get freespinRange() { return this._data.freespinRange; }

  public async init() {
    const response = await fetch('/gameConfig.json');
    if (!response.ok) throw new Error('Network response was not ok');
    this._data = await response.json();
  }

  public ready() {}
}

  