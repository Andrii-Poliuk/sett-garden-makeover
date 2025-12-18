import { Group, Object3D, Object3DEventMap } from "three";
import MeshLoader from "./MeshLoader";
import { ObjectAnimationsEnum, ObjectsMeshEnum } from "./ObjectsMeshEnum";
import AnimatedObject from "./AnimatedObject";
import { CattleType } from "../Game/Game";

export default class Sheep extends AnimatedObject {
  constructor() {
    super();
    this._cattleType = CattleType.Sheep;
  }

  async init() {
    await super.init(ObjectsMeshEnum.Sheep);
  }

  protected override loadAnimations(model: Object3D<Object3DEventMap>) {
    const idle = MeshLoader.getAnimation(ObjectAnimationsEnum.SheepIdle);
    if (idle) {
      model.animations.push(idle);
    }
    const action = MeshLoader.getAnimation(ObjectAnimationsEnum.SheepAction);
    if (action) {
      model.animations.push(action);
    }
  }
}
