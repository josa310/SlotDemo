import { Container, Graphics, PointData } from "pixi.js";
import { Grid } from "./Grid";
import { Symbol } from "./Symbol";

export class GridView extends Container {
  private readonly SYMBOL_WIDTH = 200;
  private readonly SYMBOL_HEIGHT = 200;

  public get gridHeight() {
    return this._grid.config.rowCount * this.SYMBOL_HEIGHT;
  }

  public get gridWidth() {
    return this._grid.config.reelCount * this.SYMBOL_WIDTH;
  }

  constructor(private _grid: Grid) {
    super();
  }

  public init() {
    this.createGrid();
    this.createMask();
    this.position = { x: 300, y: 130 };
  }

  public getSymbolPosition(reel: number, row: number): PointData {
    return {
      x: reel * this.SYMBOL_WIDTH,
      y: row * this.SYMBOL_HEIGHT
    };
  }

  public popSymbol(reel: number, row: number) {
    const symbol = this._grid.symbols[reel][row];
    if (!symbol) return null;

    this._grid.symbols[reel][row] = null;
    return this.removeChild(symbol);
  }

  public inserSymbol(symbol: Symbol) {
    const { reel, row } = symbol;

    symbol.position = this.getSymbolPosition(reel, row);
    this._grid.symbols[reel][row] = this.addChild(symbol);
  }

  public replaceSymbol(newSymbol: Symbol) {
    const symbol = this.popSymbol(newSymbol.reel, newSymbol.row);
    symbol?.destroy();

    this.inserSymbol(newSymbol);
  }

  private createGrid() {
    const rowCount = this._grid.config.rowCount;
    const reelCount = this._grid.config.reelCount;
    const symbols = this._grid.symbols;

    for (let reel = 0; reel < reelCount; reel++) {
      symbols.push([]);

      for (let row = 0; row < rowCount; row++) {
        const symbol = this.createStartGridSymbol(reel, row);
        symbols[reel].push(this.addChild(symbol));
      }
    }
  }

  private createStartGridSymbol(reel: number, row: number): Symbol {
    const idx = reel * this._grid.config.rowCount + row;
    const possibleSymbols = this._grid.config.symbols;
    const id = possibleSymbols[idx % possibleSymbols.length];
    const symbol = new Symbol(id);
    symbol.reel = reel;
    symbol.row = row;
    symbol.position = this.getSymbolPosition(reel, row);
    return symbol;
  }

  private createMask() {
    const mask = new Graphics();
    mask.rect(0, 0, this.gridWidth, this.gridHeight);
    mask.fill(0xffffff);
    this.mask = this.addChild(mask);
  }
}