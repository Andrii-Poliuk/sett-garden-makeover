import { Object3D, Object3DEventMap } from "three";
import MeshLoader from "./MeshLoader";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { SpriteParticleEffect } from "../Particles/SpriteParticleEffect";
import { InteractiveArea } from "./InteractiveArea";
import { CropType } from "../Game/Game";
import gsap from "gsap";

export default class MultiStageObject extends Object3D {
  protected cropTypeValue: CropType = CropType.Corn;

  public get cropType(): CropType {
    return this.cropTypeValue;
  }
  protected stage1Model?: Object3D<Object3DEventMap>;
  protected stage2Model?: Object3D<Object3DEventMap>;
  protected stage3Model?: Object3D<Object3DEventMap>;

  protected activeModel?: Object3D<Object3DEventMap>;

  protected particlesEffect?: SpriteParticleEffect;
  protected interactiveArea?: InteractiveArea;

  private shakeTimeline?: gsap.core.Timeline;
  private currentStageValue: number = 0;
  private placedAtAreaValue?: InteractiveArea;

  public get currentStage(): number {
    return this.currentStageValue;
  }

  public get placedAtArea(): InteractiveArea | undefined {
    return this.placedAtAreaValue;
  }

  public set placedAtArea(value: InteractiveArea | undefined) {
    if (this.placedAtAreaValue) {
      this.placedAtAreaValue.blocked = false;
    }
    this.placedAtAreaValue = value;
    if (this.placedAtAreaValue) {
      this.placedAtAreaValue.blocked = true;
    }
  }

  constructor() {
    super();
  }

  protected async init(modelName: ObjectsMeshEnum[]): Promise<void> {
    const models: Object3D<Object3DEventMap>[] = [];
    for (let i = 0; i < modelName.length; i++) {
      const model = MeshLoader.getMesh(modelName[i]);
      if (!model) {
        continue;
      }
      model.position.set(0, 0, 0);
      models.push(SkeletonUtils.clone(model));
    }

    [this.stage1Model, this.stage2Model, this.stage3Model] = models;

    const leafs = new SpriteParticleEffect();
    await leafs.init("./images/leaf.png", {
      color1: { r: 0.1, g: 0.6, b: 0.1 },
      color2: { r: 0.2, g: 0.7, b: 0.2 },
    });
    leafs.position.set(0, 1, 0);
    this.particlesEffect = leafs;
    this.add(leafs);

    this.interactiveArea = new InteractiveArea(1, 1, 1);
    this.interactiveArea.visible = false;
    this.add(this.interactiveArea);
  }

  protected setStage(model: Object3D<Object3DEventMap>): void {
    this.particlesEffect?.restart();
    if (this.activeModel) {
      this.remove(this.activeModel);
    }
    if (model) {
      this.add(model);
      this.activeModel = model;
      this.playBounceAnimation();
    }
  }

  private playBounceAnimation(): void {
    this.scale.set(0.9, 0.9, 0.9);
    gsap.to(this.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.4,
      ease: "elastic.out(1, 0.5)",
    });
  }

  public async playEffect(): Promise<void> {
    this.particlesEffect?.restart();
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  public playShakeAnimation(): void {
    return;
    // this.stopShakeAnimation();
    // const repeatDelay = 2;
    // const initialDelay = Math.random() * 2;
    // this.shakeTimeline = gsap.timeline({ delay: initialDelay });

    // this.shakeTimeline.to(
    //   this.scale,
    //   {
    //     x: 1.1,
    //     y: 1.1,
    //     z: 1.1,
    //     duration: 0.5,
    //     ease: "elastic.in(1, 0.5)",
    //     yoyo: true,
    //     delay: repeatDelay,
    //     onComplete: () => {
    //       this.shakeTimeline?.restart();
    //     },
    //   },
    //   "<",
    // );

    // this.shakeTimeline.play();
  }

  public stopShakeAnimation(): void {
    if (this.shakeTimeline) {
      this.shakeTimeline.kill();
      this.shakeTimeline = undefined;
      this.scale.set(1, 1, 1);
    }
  }

  public async playDisappearAnimation(): Promise<void> {
    const timeline = gsap.timeline();

    timeline.to(
      this.scale,
      {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        duration: 0.2,
        ease: "elastic.in(1, 0.5)",
      },
      "<",
    );
    timeline.to(
      this.rotation,
      {
        y: this.rotation.y + 0.1,
        duration: 0.05,
        // ease: "power1.inOut",
      },
      "<",
    );
    timeline.to(this.rotation, {
      y: this.rotation.y - 0.1,
      duration: 0.05,
      // ease: "power1.inOut",
    });
    timeline.to(this.rotation, {
      y: this.rotation.y + 0.1,
      duration: 0.05,
    });

    await Promise.all([timeline, this.playEffect()]);
  }

  public setStage1(): void {
    this.currentStageValue = 1;
    this.stage1Model && this.setStage(this.stage1Model);
    if (this.interactiveArea) {
      this.interactiveArea.visible = false;
    }
  }
  public setStage2(): void {
    this.currentStageValue = 2;
    this.stage2Model && this.setStage(this.stage2Model);
    if (this.interactiveArea) {
      this.interactiveArea.visible = false;
    }
  }
  public setStage3(): void {
    this.currentStageValue = 3;
    this.stage3Model && this.setStage(this.stage3Model);
    if (this.interactiveArea) {
      this.interactiveArea.visible = true;
    }
  }

  public advanceStage(): void {
    if (this.currentStageValue >= 3) return;

    switch (this.currentStageValue) {
      case 0:
      case 1:
        this.setStage2();
        break;
      case 2:
        this.setStage3();
        break;
    }
  }

  public enableInteraction(onPress: (sender: Object3D) => Promise<void>): void {
    this.interactiveArea?.enableInteractiveArea(undefined, onPress);
  }

  public disableInteraction(): void {
    this.interactiveArea?.disableInteractiveArea();
  }

  public update(delta: number): void {
    this.interactiveArea?.update(delta);
  }

  public destroy(): void {
    this.stopShakeAnimation();
    if (this.interactiveArea) {
      this.interactiveArea.destroy();
    }
    if (this.placedAtAreaValue) {
      this.placedAtAreaValue.blocked = false;
      this.placedAtAreaValue = undefined;
    }
    if (this.particlesEffect) {
      this.particlesEffect.destroy();
    }
  }
}
