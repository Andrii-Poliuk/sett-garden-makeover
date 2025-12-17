import { Object3D, Object3DEventMap } from "three";
import MeshLoader from "./MeshLoader";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { SpriteParticleEffect } from "../Particles/SpriteParticleEffect";

export default class MultiStageObject extends Object3D {
  stage1Model?: Object3D<Object3DEventMap>;
  stage2Model?: Object3D<Object3DEventMap>;
  stage3Model?: Object3D<Object3DEventMap>;

  activeModel?: Object3D<Object3DEventMap>;

  protected particlesEffect?: SpriteParticleEffect;

  constructor() {
    super();
  }

  protected async init(modelName: ObjectsMeshEnum[]) {
    const models: Object3D<Object3DEventMap>[] = [];
    for (let i = 0; i < modelName.length; i++) {
      let model = MeshLoader.getMesh(modelName[i]);
      if (!model) {
        continue;
      }
      model.position.set(0, 0, 0);
      models.push(SkeletonUtils.clone(model));
    }

    [this.stage1Model, this.stage2Model, this.stage3Model] = models;

    const leafs = new SpriteParticleEffect();
    await leafs.init("./images/leaf.png",
      {
        color1: {r:0.1,g:0.6,b:0.1},
        color2: {r:0.2,g:0.7,b:0.2},
      }
    );
    leafs.position.set(0, 1, 0);
    this.particlesEffect = leafs;
    this.add(leafs);
  }

  protected setStage(model: Object3D<Object3DEventMap>) {
    this.particlesEffect?.restart();
    if (this.activeModel) {
      this.remove(this.activeModel);
    }
    if (model) {
      this.add(model);
      this.activeModel = model;
    }
  }

  public playEffect() {
    this.particlesEffect?.restart();
  }

  public setStage1() {
    this.stage1Model && this.setStage(this.stage1Model);
  }
  public setStage2() {
    this.stage2Model && this.setStage(this.stage2Model);
  }
  public setStage3() {
    this.stage3Model && this.setStage(this.stage3Model);
  }
}
