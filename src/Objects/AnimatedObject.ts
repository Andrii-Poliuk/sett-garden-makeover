import {
  AnimationAction,
  AnimationMixer,
  Object3D,
  Object3DEventMap,
} from "three";
import MeshLoader from "./MeshLoader";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { SpriteParticleEffect } from "../Particles/SpriteParticleEffect";
import { CattleType } from "../Game/Game";
import SoundSource from "./SoundSource";

export default class AnimatedObject extends Object3D {
  mixer?: AnimationMixer;

  animationActions: { [key: string]: AnimationAction } = {};
  activeAction?: AnimationAction;

  protected particlesEffect?: SpriteParticleEffect;
  protected _cattleType: CattleType = CattleType.Chicken;
  private _soundSource?: SoundSource;

  public get cattleType(): CattleType {
    return this._cattleType;
  }

  public get soundSource(): SoundSource | undefined {
    return this._soundSource;
  }

  public set soundSource(value: SoundSource | undefined) {
    value && this.add(value);
    this._soundSource = value;
  }

  constructor() {
    super();
  }

  protected loadAnimations(_model: Object3D<Object3DEventMap>) {}

  protected async init(modelName: ObjectsMeshEnum) {
    let model = MeshLoader.getMesh(modelName);
    if (!model) {
      return;
    }
    model = SkeletonUtils.clone(model);
    model.position.set(0, 0, 0);

    this.loadAnimations(model);
    this.mixer = new AnimationMixer(model);

    this.animationActions["idle"] = this.mixer.clipAction(model.animations[0]);
    this.animationActions["action"] = this.mixer.clipAction(
      model.animations[1],
    );

    this.setAction(this.animationActions["idle"]);

    this.add(model);

    const smoke = new SpriteParticleEffect();
    await smoke.init("./images/smoke.png", {
      color1: { r: 0.8, g: 0.8, b: 0.8 },
      color2: { r: 0.7, g: 0.7, b: 0.7 },
    });
    this.particlesEffect = smoke;
    this.add(smoke);
    smoke.position.set(0, 2, 0);
    smoke.scale.set(1.1, 1.1, 1.1);
  }

  public playEffect() {
    this.particlesEffect?.restart();
  }

  public update(delta: number) {
    this.mixer?.update(delta);
    this._soundSource?.update(delta);
  }

  public playIdle() {
    const action = this.animationActions["idle"];
    this.setAction(action);
  }

  public playAction() {
    const action = this.animationActions["action"];
    this.setAction(action);
  }

  protected setAction(action: AnimationAction) {
    if (this.activeAction != action) {
      this.activeAction?.fadeOut(0.1);
      action.reset().fadeIn(0.1).play();
      this.activeAction = action;
    }
  }

  public destroy(): void {
    if (this.particlesEffect) {
      this.particlesEffect.destroy();
    }
    this._soundSource?.destroy();
  }
}
