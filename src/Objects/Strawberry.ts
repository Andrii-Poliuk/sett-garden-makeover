import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";
import { CropType } from "../Game/Game";

export default class Strawberry extends MultiStageObject {
  constructor() {
    super();
    this._cropType = CropType.Strawberry;
  }

  async init() {
    await super.init([
      ObjectsMeshEnum.Strawberry1,
      ObjectsMeshEnum.Strawberry2,
      ObjectsMeshEnum.Strawberry3,
    ]);
    if (this.interactiveArea) {
      this.interactiveArea.setScale(3, 2, 3);
    }
  }
}
