import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";

export default class Tomato extends MultiStageObject {
  constructor() {
    super();
  }

  async init() {
    await super.init([
      ObjectsMeshEnum.Tomato1,
      ObjectsMeshEnum.Tomato2,
      ObjectsMeshEnum.Tomato3,
    ]);
  }
}
