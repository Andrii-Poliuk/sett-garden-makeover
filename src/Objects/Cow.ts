import { Object3D, Object3DEventMap } from "three";
import MeshLoader from "./MeshLoader";
import { ObjectAnimationsEnum, ObjectsMeshEnum } from "./ObjectsMeshEnum";
import AnimatedObject from "./AnimatedObject";
import { CattleType } from "../Game/Game";

export default class Cow extends AnimatedObject {
  constructor() {
    super();
    this._cattleType = CattleType.Cow;
  }

  async init() {
    await super.init(ObjectsMeshEnum.Cow);
  }

  protected override loadAnimations(model: Object3D<Object3DEventMap>) {
    const idle = MeshLoader.getAnimation(ObjectAnimationsEnum.CowIdle);
    if (idle) {
      model.animations.push(idle);
    }
    const action = MeshLoader.getAnimation(ObjectAnimationsEnum.CowAction);
    if (action) {
      model.animations.push(action);
    }
  }
}
