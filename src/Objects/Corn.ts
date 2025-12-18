import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";
import { Object3D } from "three";

export default class Corn extends MultiStageObject {
  constructor() {
    super();
  }

  async init() {
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
