import { Object3D } from "three";
import MeshLoader from "./MeshLoader";
import * as THREE from "three";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

export default class ObjectHighlight extends Object3D {
  constructor() {
    super();
  }

  static greenTransparentMat: THREE.MeshBasicMaterial | undefined;

  async init(
    modelName: ObjectsMeshEnum,
    color: THREE.ColorRepresentation = 0x00ff00,
  ) {
    let model = MeshLoader.getMesh(modelName);
    if (!model) {
      return;
    }
    model = SkeletonUtils.clone(model);
    model.position.set(0, 0, 0);

    if (!ObjectHighlight.greenTransparentMat) {
      ObjectHighlight.greenTransparentMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.FrontSide,
      });
    }

    model.traverse((m) => {
      const mesh = m as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        mesh.castShadow = false;
        mesh.material = ObjectHighlight.greenTransparentMat!;
      }
    });

    this.add(model);
  }
}
