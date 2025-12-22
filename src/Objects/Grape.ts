import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";
import { CropType } from "../Game/Game";

export default class Grape extends MultiStageObject {
  constructor() {
    super();
    this.cropTypeValue = CropType.Grape;
  }

  public async init(): Promise<void> {
    await super.init([
      ObjectsMeshEnum.Grape1,
      ObjectsMeshEnum.Grape2,
      ObjectsMeshEnum.Grape3,
    ]);
    if (this.interactiveArea) {
      this.interactiveArea.setScale(3, 3, 3);
    }
  }
}
