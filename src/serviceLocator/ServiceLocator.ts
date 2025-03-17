import { FeatureHandler } from "../features/FeatureHandler";
import { ModuleHandler } from "../modules/ModulHandler";

export class ServiceLocator {
  private static _moduleHandler = new ModuleHandler();
  private static _featureHandler = new FeatureHandler();

  public static get moduleHandler() { return this._moduleHandler; }
  public static set moduleHandler(value) { this._moduleHandler = value; }

  public static get featureHandler() { return this._featureHandler; }
  public static set featureHandler(value) { this._featureHandler = value; }
}