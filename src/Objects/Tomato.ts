import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";
import { CropType } from "../Game/Game";

export default class Tomato extends MultiStageObject {
  constructor() {
    super();
    this.cropTypeValue = CropType.Tomato;
  }

  public async init() {
    await super.init([
      ObjectsMeshEnum.Tomato1,
      ObjectsMeshEnum.Tomato2,
      ObjectsMeshEnum.Tomato3,
    ]);
    if (this.interactiveArea) {
      this.interactiveArea.setScale(3, 3, 3);
    }
  }
}
