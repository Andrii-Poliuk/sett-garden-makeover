import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";

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
  }
}
