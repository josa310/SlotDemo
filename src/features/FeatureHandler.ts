import { IModule, Library } from "../modules/ModulHandler";

export enum FeatureId {
  SPIN,
  WIN,
  FREESPIN,
}

export interface IFeature extends IModule {
  process(...args: any[]): Promise<void>;
}

export class FeatureHandler extends Library<IFeature> {}