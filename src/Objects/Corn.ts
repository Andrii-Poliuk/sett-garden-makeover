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
      const areaScale = this.interactiveArea.scale.clone();
      this.interactiveArea.scale.set(areaScale.x * 1.5, areaScale.y * 4, areaScale.z * 1.5);
    }
  }
}
