import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AnimationClip, Object3D, Object3DEventMap } from "three";
import { ObjectAnimationsEnum, ObjectsMeshEnum } from "./ObjectsMeshEnum";

export default class MeshLoader {
  objects?: GLTF;
  ground?: GLTF;
  meshes: Map<ObjectsMeshEnum, Object3D<Object3DEventMap>> = new Map();
  animations: Map<ObjectAnimationsEnum, AnimationClip> = new Map();

  private constructor() {}

  private static _instance: MeshLoader;

  public static get Instance(): MeshLoader {
    if (!MeshLoader._instance) {
      MeshLoader._instance = new MeshLoader();
    }
    return MeshLoader._instance;
  }

  public static getScene(): Object3D {
    return MeshLoader.Instance.ground!.scene;
  }

  public static getMesh(mesh: ObjectsMeshEnum): Object3D<Object3DEventMap> | undefined {
    if (MeshLoader.Instance.meshes.has(mesh)) {
      return MeshLoader.Instance.meshes.get(mesh);
    } else {
      return undefined;
    }
  }

  public static getAnimation(
    animation: ObjectAnimationsEnum
  ): AnimationClip | undefined {
    if (MeshLoader.Instance.animations.has(animation)) {
      return MeshLoader.Instance.animations.get(animation);
    } else {
      return undefined;
    }
  }

  public static async loadModelsAsync() {
    const gltfLoader = new GLTFLoader();
    const [objects, ground] = await Promise.all([
      gltfLoader.loadAsync("models/objects2.glb"),
      gltfLoader.loadAsync("models/ground2.glb"),
    ]);
    ground.scene.static = true;
    // objects.scene.static = true;
    MeshLoader.Instance.objects = objects;
    MeshLoader.Instance.ground = ground;

    for (const key of Object.values(ObjectsMeshEnum)) {
      const mesh = objects.scene.getObjectByName(key) as Object3D<Object3DEventMap>;
      if (mesh) {
        MeshLoader.Instance.meshes.set(key, mesh);
      }
    }
    for (let i = 0; i < objects.animations.length; i++) {
      const animation = objects.animations[i];
      const key = animation.name as ObjectAnimationsEnum;
      MeshLoader.Instance.animations.set(key, animation);
    }
  }
}
