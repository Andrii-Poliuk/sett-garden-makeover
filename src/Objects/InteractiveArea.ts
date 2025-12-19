import {
  BoxGeometry,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Vector3,
} from "three";
import ObjectHighlight from "./ObjectHighlight";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { RaycastManager } from "../RaycastManager";

export class InteractiveArea extends Mesh {
  public hovered = false;
  private _blocked = false;
  public onPress?: (sender: Object3D) => Promise<void>;

  public get blocked(): boolean {
    return this._blocked;
  }

  public set blocked(value: boolean) {
    this._blocked = value;
    this.visible = !this._blocked;
  }

  geometry: BufferGeometry;
  material: MeshBasicMaterial;

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

  public disableInteractiveArea() {
    this.onPress = undefined;
    RaycastManager.instance.removeInteractiveArea(this);
    this.visible = false;
    if (this.hint) {
      this.remove(this.hint);
      this.hint = undefined;
    }
  }

  // TODO: remove enabled
  public enableInteractiveArea(
    hint?: Object3D,
    onPress?: (sender: Object3D) => Promise<void>
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

  update(delta: number) {
    if (!this.visible) {
      return;
    }
    this.hovered
      ? this.scale.lerp(this.hoveredScale, delta * 20)
      : this.scale.lerp(this.originalScale, delta * 20);

    if (this.hint instanceof ObjectHighlight) {
      this.hint.update(delta);
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
