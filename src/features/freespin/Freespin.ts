import { ModuleId } from "../../modules/ModulHandler";
import { ICommand } from "../../modules/RGS/Command";
import { UI } from "../../modules/UI/UI";
import { UIView } from "../../modules/UI/view/UIView";
import { ServiceLocator } from "../../serviceLocator/ServiceLocator";
import { FeatureHandler, FeatureId, IFeature } from "../FeatureHandler";

export interface IFreespinData {
  count: number;
  commands: ICommand[];
}

export class FreespinFeature implements IFeature {
  public readonly id = FeatureId.FREESPIN;

  private _uiView: UIView;
  private _featureHandler: FeatureHandler;
  
  public async init() {
    this._featureHandler = ServiceLocator.featureHandler;
    this._uiView = ServiceLocator.moduleHandler.getModule<UI>(ModuleId.UI).view;
  }

  public ready() {}

  public async process(data: IFreespinData) {
    const counter = this._uiView.freeSpinCounter;
    counter.visible = true;

    let freeSpinIndex = 0;
    for (const command of data.commands) {
      if (command.type == FeatureId.SPIN) {
        counter.setCount(++freeSpinIndex, data.count);
      }
      
      const feature = this._featureHandler.getModule(command.type);
      if (!feature) continue;
      
      await feature.process(command.data);
    }

    counter.visible = false;
  }
}