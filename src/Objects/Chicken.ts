import { Object3D, Object3DEventMap } from "three";
import MeshLoader from "./MeshLoader";
import { ObjectAnimationsEnum, ObjectsMeshEnum } from "./ObjectsMeshEnum";
import AnimatedObject from "./AnimatedObject";
import { CattleType } from "../Game/Game";

export default class Chicken extends AnimatedObject {
  constructor() {
    super();
    this.cattleTypeValue = CattleType.Chicken;
  }

  async init() {
    await super.init(ObjectsMeshEnum.Chicken);
  }

  protected override loadAnimations(model: Object3D<Object3DEventMap>) {
    const idle = MeshLoader.getAnimation(ObjectAnimationsEnum.ChickenIdle);
    if (idle) {
      model.animations.push(idle);
    }
    const action = MeshLoader.getAnimation(ObjectAnimationsEnum.ChickenAction);
    if (action) {
      model.animations.push(action);
    }
  }
}
