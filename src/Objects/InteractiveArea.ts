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
  public onPress?: (sender: Object3D) => Promise<void>;

  geometry: BufferGeometry;
  material: MeshBasicMaterial;

  private hoveredScale: Vector3;
  private originalScale: Vector3;

  private hint?: Object3D;

  constructor(scaleX: number = 2, scaleY: number = 2, scaleZ: number = 2) {
    super();
    this.geometry = new BoxGeometry();
    this.geometry.scale(scaleX, scaleY, scaleZ);
    this.geometry.translate(0, scaleY/2, 0);
    this.material = new MeshBasicMaterial();
    this.material.visible = false;

    this.originalScale = this.scale.clone();
    this.hoveredScale = this.scale.clone().multiplyScalar(1.05);

    //TODO: remove
    this.material.wireframe = true;
    this.material.visible = true;
  }

  public disableInteractiveArea() {
    this.onPress = undefined;
    RaycastManager.instance.removeInteractiveArea(this);
    this.visible = false;
  }

  // TODO: remove enabled
  public enableInteractiveArea(
    enabled: boolean,
    hint: Object3D,
    onPress?: (sender: Object3D) => Promise<void>
  ): void {
    if (this.hint) {
      this.hint.visible = false;
      this.remove(this.hint);
      this.hint = undefined;
    }
    if (enabled) {
      this.hint = SkeletonUtils.clone(hint);
      this.hint.visible = true;
      this.add(this.hint);
      this.onPress = onPress;
      RaycastManager.instance.addInteractiveArea(this);
    } else {
      this.onPress = undefined;
      RaycastManager.instance.removeInteractiveArea(this);
    }
  }

  update(delta: number) {
    if (!this.visible) {
      return;
    }
    this.hovered
      ? this.scale.lerp(this.hoveredScale, delta * 20)
      : this.scale.lerp(this.originalScale, delta * 20);

    // this.clicked ? this.v.set(1.5, 1.5, 1.5) : this.v.set(1.0, 1.0, 1.0)
    // this.scale.lerp(this.v, delta * 5)
  }
}
