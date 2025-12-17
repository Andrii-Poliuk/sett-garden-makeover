import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";

export default class Grape extends MultiStageObject {
  constructor() {
    super();
  }

  async init() {
    await super.init([
      ObjectsMeshEnum.Grape1,
      ObjectsMeshEnum.Grape2,
      ObjectsMeshEnum.Grape3,
    ]);
  }
}
