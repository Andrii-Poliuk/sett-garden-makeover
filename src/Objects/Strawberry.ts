import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import MultiStageObject from "./MultiStageObject";

export default class Strawberry extends MultiStageObject {
  constructor() {
    super();
  }

  async init() {
    await super.init([
      ObjectsMeshEnum.Strawberry1,
      ObjectsMeshEnum.Strawberry2,
      ObjectsMeshEnum.Strawberry3,
    ]);
  }
}
