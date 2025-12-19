import { Object3D } from "three";
import MeshLoader from "./MeshLoader";
import * as THREE from "three";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

export default class ObjectHighlight extends Object3D {
  // private pulseDelay: number = 1.5;
  // private pulseDuration: number = 0.1;
  // private pulseTime: number = 0;
  // private readonly pulseAmount: number = 0.01;

  constructor() {
    super();
  }

  async init(
    modelName: ObjectsMeshEnum,
    color: THREE.ColorRepresentation = 0x00ff00
  ) {
    let model = MeshLoader.getMesh(modelName);
    if (!model) {
      return;
    }
    model = SkeletonUtils.clone(model);
    model.position.set(0, 0, 0);

    const greenTransparentMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.FrontSide,
    });

    model.traverse((m) => {
      const mesh = m as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        mesh.material = greenTransparentMat;
      }
    });

    this.add(model);
  }

  public update(delta: number): void {
    // this.pulseTime += delta;
    // if (this.pulseTime > this.pulseDelay) {
    //   const animationTime = this.pulseTime - this.pulseDelay;
    //   const peakTime = this.pulseDuration * 0.5;
    //   const pulse = this.pulseAmount * ((animationTime < peakTime) ?
    //   animationTime / peakTime
    //   : (animationTime / peakTime) - 1);
    //   const scaleX = this.scale.x + pulse;
    //   const scaleY = this.scale.y + pulse;
    //   const scaleZ = this.scale.z + pulse;
    //   this.scale.set(scaleX, scaleY, scaleZ);
    // }
    // if (this.pulseTime > this.pulseDelay + this.pulseDuration) {
    //   this.pulseTime = 0;
    //   this.scale.set(1, 1, 1);
    // }
  }
}
