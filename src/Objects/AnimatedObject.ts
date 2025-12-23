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
import gsap from "gsap";

export default class AnimatedObject extends Object3D {
  protected mixer?: AnimationMixer;

  protected animationActions: Record<string, AnimationAction> = {};
  protected activeAction?: AnimationAction;

  protected particlesEffect?: SpriteParticleEffect;
  protected cattleTypeValue: CattleType = CattleType.Chicken;
  private soundSourceInstance?: SoundSource;
  private baseScale: number = 1;

  public get cattleType(): CattleType {
    return this.cattleTypeValue;
  }

  public get soundSource(): SoundSource | undefined {
    return this.soundSourceInstance;
  }

  public set soundSource(value: SoundSource | undefined) {
    value && this.add(value);
    this.soundSourceInstance = value;
  }

  constructor() {
    super();
  }

  protected loadAnimations(_model: Object3D<Object3DEventMap>): void {}

  protected async init(modelName: ObjectsMeshEnum): Promise<void> {
    let model = MeshLoader.getMesh(modelName);
    if (!model) {
      return;
    }
    model = SkeletonUtils.clone(model);
    model.position.set(0, 0, 0);

    this.baseScale = 0.97 + Math.random() * 0.05;

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
    this.particlesEffect.stop();
  }

  public playEffect(): void {
    this.particlesEffect?.restart();
  }

  public playBounceAnimation(): void {
    const startScale = this.baseScale * 0.9;
    this.scale.set(startScale, startScale, startScale);
    gsap.to(this.scale, {
      x: this.baseScale,
      y: this.baseScale,
      z: this.baseScale,
      duration: 0.4,
      ease: "elastic.out(1, 0.5)",
    });
  }

  public playAppearAnimation(): void {
    this.playBounceAnimation();
    this.playEffect();
  }

  public update(delta: number): void {
    this.mixer?.update(delta);
    this.soundSourceInstance?.update(delta);
  }

  public playIdle(): void {
    const action = this.animationActions["idle"];
    this.setAction(action);
  }

  public playAction(): void {
    const action = this.animationActions["action"];
    this.setAction(action);
  }

  protected setAction(action: AnimationAction): void {
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
    this.soundSourceInstance?.destroy();
  }
}
