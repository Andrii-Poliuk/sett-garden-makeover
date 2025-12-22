import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";
import { CropType } from "../Game/Game";

export default class Corn extends MultiStageObject {
  constructor() {
    super();
    this.cropTypeValue = CropType.Corn;
  }

  public async init(): Promise<void> {
    await super.init([
      ObjectsMeshEnum.Corn1,
      ObjectsMeshEnum.Corn2,
      ObjectsMeshEnum.Corn3,
    ]);
    if (this.interactiveArea) {
      this.interactiveArea.setScale(1.5, 4, 1.5);
    }
  }
}
