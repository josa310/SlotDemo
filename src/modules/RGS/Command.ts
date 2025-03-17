import { FeatureId } from "../../features/FeatureHandler";

export interface ICommand {
  type: FeatureId;
  data?: any;
}