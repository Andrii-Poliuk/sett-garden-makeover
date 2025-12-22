import { Object3D } from "three";
import MeshLoader from "./MeshLoader";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { InteractiveArea } from "./InteractiveArea";
import { LandType } from "../Game/Game";
import gsap from "gsap";

export default class PlaceableObject extends Object3D {
  protected interactiveAreas: InteractiveArea[] = [];
  protected _landType: LandType = LandType.Ground;

  public get landType(): LandType {
    return this._landType;
  }

  constructor() {
    super();
  }

  protected async init(modelName: ObjectsMeshEnum) {
    let model = MeshLoader.getMesh(modelName);
    if (!model) {
      return;
    }
    model = SkeletonUtils.clone(model);
    model.position.set(0, 0, 0);

    this.add(model);
    this.playBounceAnimation();
  }

  public getInteractiveAreas(): InteractiveArea[] {
    return this.interactiveAreas;
  }

  public disableInteraction(): void {
    this.interactiveAreas.forEach((area) => {
      area.disableInteractiveArea();
    });
  }

  public enableInteraction(
    hint: Object3D,
    onPress: (sender: Object3D) => Promise<void>,
  ): void {
    this.interactiveAreas.forEach((area) => {
      area.enableInteractiveArea(hint, onPress);
    });
  }

  public removeInteractiveArea(interactiveArea: InteractiveArea): void {
    const index = this.interactiveAreas.indexOf(interactiveArea);
    if (index !== -1) {
      this.interactiveAreas.splice(index, 1);
    }
    this.remove(interactiveArea);
    interactiveArea.disableInteractiveArea();
  }

  public update(delta: number): void {
    this.interactiveAreas.forEach((area) => {
      area.update(delta);
    });
  }

  public playBounceAnimation(): void {
    this.scale.set(0.9, 0.9, 0.9);
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.4,
      ease: "elastic.out(1, 0.5)",
    });
  }

  public destroy(): void {
    this.interactiveAreas.forEach((area) => {
      area.disableInteractiveArea();
    });
    this.interactiveAreas = [];
  }
}
