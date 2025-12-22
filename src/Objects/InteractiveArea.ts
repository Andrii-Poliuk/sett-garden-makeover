import {
  BoxGeometry,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { RaycastManager } from "../Game/RaycastManager";

export class InteractiveArea extends Mesh {
  public hovered = false;
  private blockedValue = false;
  public onPress?: (sender: Object3D) => Promise<void>;

  public get blocked(): boolean {
    return this.blockedValue;
  }

  public set blocked(value: boolean) {
    this.blockedValue = value;
    this.visible = !this.blockedValue;
  }

  public override geometry: BufferGeometry;
  public override material: MeshBasicMaterial;

  private hoveredScale: Vector3;
  private originalScale: Vector3;

  private hint?: Object3D;

  constructor(scaleX: number = 2, scaleY: number = 2, scaleZ: number = 2) {
    super();
    this.geometry = new BoxGeometry();
    this.geometry.scale(scaleX, scaleY, scaleZ);
    this.geometry.translate(0, scaleY / 2, 0);
    this.material = new MeshBasicMaterial();
    this.material.visible = false;

    this.originalScale = this.scale.clone();
    this.hoveredScale = this.originalScale.clone().multiplyScalar(1.05);
    // this.scale.copy(this.originalScale);

    //TODO: remove
    // this.material.wireframe = true;
    // this.material.visible = true;
  }

  public setScale(x: number, y: number, z: number): void {
    this.originalScale.set(x, y, z);
    this.hoveredScale.set(x * 1.05, y * 1.05, z * 1.05);
    this.scale.set(x, y, z);
  }

  public disableInteractiveArea(): void {
    this.onPress = undefined;
    RaycastManager.instance.removeInteractiveArea(this);
    this.visible = false;
    if (this.hint) {
      this.remove(this.hint);
      this.hint = undefined;
    }
  }

  public enableInteractiveArea(
    hint: Object3D | undefined,
    onPress: (sender: Object3D) => Promise<void>,
  ): void {
    if (this.hint) {
      this.hint.visible = false;
      this.remove(this.hint);
      this.hint = undefined;
    }
    if (hint) {
      this.hint = SkeletonUtils.clone(hint);
      this.hint.visible = true;
      this.add(this.hint);
    }
    this.onPress = onPress;
    RaycastManager.instance.addInteractiveArea(this);
    this.visible = true;
  }

  public update(delta: number): void {
    if (!this.visible) {
      return;
    }
    if (this.hovered) {
      this.scale.lerp(this.hoveredScale, delta * 20);
    } else {
      this.scale.lerp(this.originalScale, delta * 20);
    }
  }

  public destroy(): void {
    this.disableInteractiveArea();
    if (this.hint) {
      this.remove(this.hint);
      this.hint = undefined;
    }
  }
}
