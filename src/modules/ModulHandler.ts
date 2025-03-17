
export interface IModule {
  id: number;
  init(): Promise<void>;
  ready(): void;
}

export class Library<T extends IModule> {
  protected _modules = new Map<number, T>();

  public register(module: T) {
    this._modules.set(module.id, module);
  }

  public getModule<K extends T>(id: number): K {
    return this._modules.get(id) as K;
  }

  public async initModules() {
    const modules = Array.from(this._modules.values());
    await Promise.all(modules.map(module => module.init()));
    modules.forEach(module => module.ready());
  }
}

export class ModuleHandler extends Library<IModule> {}

export enum ModuleId {
  CONFIG,
  GAME,
  GRID,
  UI,
  RGS,
}