import { FeatureId } from "../../features/FeatureHandler";
import { IFreespinData } from "../../features/freespin/Freespin";
import { IWinData } from "../../features/win/Win";
import { ServiceLocator } from "../../serviceLocator/ServiceLocator";
import { Config, IGridData, IPaytable } from "../Config";
import { IGridPosition } from "../Grid/Grid";
import { IModule, ModuleId } from "../ModulHandler";
import { ICommand } from "./Command";
import { RNG } from "./RNG";

export class RGS implements IModule {
  public readonly id = ModuleId.RGS;
  private _gridData: IGridData;
  private _symbols: number[];
  private _paytable: IPaytable;
  private _scatterID: number;
  private _freespinChance: number;
  private _freespinRange: number[];
  private _rng = new RNG();

  public async init() {
    (document as any).forceRNG = (seed: number) => this._rng.seed = seed;
  }

  public ready() {
    const moduleHandler = ServiceLocator.moduleHandler;

    const congigModule = moduleHandler.getModule<Config>(ModuleId.CONFIG);
    this._gridData = congigModule.data.grid;
    this._symbols = congigModule.data.symbols;
    this._paytable = congigModule.data.paytable;
    this._scatterID = congigModule.data.scatterID;
    this._freespinChance = congigModule.data.freespinChance;
    this._freespinRange = congigModule.data.freespinRange;
  }

  public spin(): ICommand[] {
    console.log("Round Seed:" + this._rng.seed);
    return this.generateSpin();
  }

  private generateSpin(inFreespin: boolean = false) {
    const symbolIds = this.generateGrid();
    
    const freespinCount = inFreespin ? 0 : this.drawFreespin(symbolIds);

    const wins = this.generateWins(symbolIds);

    const commands = [this.createCommand(FeatureId.SPIN, symbolIds)];
    if (wins.length > 0) {
      commands.push(this.createCommand(FeatureId.WIN, wins));
    }
    if (freespinCount > 0) {
      commands.push(this.generateFreespins(freespinCount));
    }

    return commands;
  }

  private generateFreespins(count: number) {
    const commands: ICommand[] = [];
    for (let i = 0; i < count; i++) {
      commands.push(...this.generateSpin(true));
    }

    const data: IFreespinData = { count, commands };
    return this.createCommand(FeatureId.FREESPIN, data);
  }

  private drawFreespin(symbolIds: number[][]) {
    const freespinChance = Math.round(this._freespinChance * 100);
    const freespinWon = this._rng.getRandomInt(0, 100) < freespinChance;
    
    const scatterCount = freespinWon ? 3 : this._rng.getRandomInt(0, 3);
    this.placeScatters(symbolIds, scatterCount);
    
    const freespinCount = freespinWon ? this._rng.getRandomInt(this._freespinRange[0], this._freespinRange[1]) : 0;
    return freespinCount;
  }

  private placeScatters(symbolIds: number[][], scatterCount: number) {
    while (scatterCount > 0) {
      const reel = this._rng.getRandomInt(0, this._gridData.reelCount);
      const row = this._rng.getRandomInt(0, this._gridData.rowCount);

      if (symbolIds[reel][row] == this._scatterID) continue;
      symbolIds[reel][row] = this._scatterID;
      scatterCount--;
    }
  }

  private generateGrid(): number[][] {
    const symbolIds: number[][] = [];
    for (let reel = 0; reel < this._gridData.reelCount; reel++) {
      symbolIds.push([]);
      for (let row = 0; row < this._gridData.rowCount; row++) {
        const symbolIndex = this._rng.getRandomInt(0, this._symbols.length);
        const symbolID = this._symbols[symbolIndex];
        symbolIds[reel].push(symbolID);
      }
    }

    return symbolIds;
  }

  private generateWins(symbolIds: number[][]) {
    const wins: IWinData[] = [];
    const ids = new Set(symbolIds[0])
    for (const id of ids) {
      const positions = this.getSymbolPositions(symbolIds, id);

      const winBase = this._paytable[id][positions.length - 1];
      if (winBase <= 0) continue;

      const ways = positions.reduce((acc, cur) => acc * cur.length, 1);
      const winAmount = winBase * ways;
      wins.push({ positions: positions.flat(), winAmount, id });
    }

    return wins;
  }

  private getSymbolPositions(symbolIds: number[][], id: number): IGridPosition[][] {
    const positions: IGridPosition[][] = [];
    for (let reel = 0; reel < symbolIds.length; reel++) {
      if (!symbolIds[reel].includes(id)) break;

      positions.push([]);
      for (let row = 0; row < symbolIds[reel].length; row++) {
        if (symbolIds[reel][row] != id) continue;
        positions[reel].push({ reel, row });
      }
    }

    return positions;
  }

  private createCommand(type: FeatureId, data: any): ICommand {
    return { type, data};
  }
}