import { Group, Object3D, Object3DEventMap } from "three";
import MeshLoader from "./MeshLoader";
import { ObjectAnimationsEnum, ObjectsMeshEnum } from "./ObjectsMeshEnum";
import AnimatedObject from "./AnimatedObject";

export default class Cow extends AnimatedObject {
  constructor() {
    super();
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
