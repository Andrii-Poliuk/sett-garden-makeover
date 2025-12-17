import {
  AnimationAction,
  AnimationMixer,
  Group,
  LoopOnce,
  Object3D,
  Object3DEventMap,
} from "three";
import MeshLoader from "./MeshLoader";
import * as THREE from "three";
import { ObjectAnimationsEnum, ObjectsMeshEnum, OjectPivotFix } from "./ObjectsMeshEnum";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

export default class ObjectHighlight extends Object3D {
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
      opacity: 0.5,
      side: THREE.FrontSide, //THREE.DoubleSide,
    });

    model.traverse((m) => {
      const mesh = m as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        mesh.material = greenTransparentMat;
      }
    });

    this.add(model);
  }
}
