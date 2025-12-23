import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  AnimationClip,
  BufferAttribute,
  BufferGeometry,
  Color,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Object3DEventMap,
} from "three";

import { ObjectAnimationsEnum, ObjectsMeshEnum } from "./ObjectsMeshEnum";

export default class MeshLoader {
  private ground?: GLTF;
  private groundInstancedScene?: Object3D;
  private meshes: Map<ObjectsMeshEnum, Object3D<Object3DEventMap>> = new Map();
  private animations: Map<ObjectAnimationsEnum, AnimationClip> = new Map();

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

  public static getGroundInstancedScene(): Object3D | undefined {
    return MeshLoader.Instance.groundInstancedScene;
  }

  public static getMesh(
    mesh: ObjectsMeshEnum,
  ): Object3D<Object3DEventMap> | undefined {
    if (MeshLoader.Instance.meshes.has(mesh)) {
      return MeshLoader.Instance.meshes.get(mesh);
    } else {
      return undefined;
    }
  }

  public static getAnimation(
    animation: ObjectAnimationsEnum,
  ): AnimationClip | undefined {
    if (MeshLoader.Instance.animations.has(animation)) {
      return MeshLoader.Instance.animations.get(animation);
    } else {
      return undefined;
    }
  }

  public static async loadModelsAsync(): Promise<void> {
    const gltfLoader = new GLTFLoader();
    const [objects, ground] = await Promise.all([
      gltfLoader.loadAsync("models/objects2.glb"),
      gltfLoader.loadAsync("models/ground3.glb"),
    ]);
    MeshLoader.Instance.ground = ground;

    // Create instanced scene from ground
    MeshLoader.Instance.groundInstancedScene =
      this.createInstancedSceneFromGLTF(ground, 200);

    for (const key of Object.values(ObjectsMeshEnum)) {
      const mesh = objects.scene.getObjectByName(
        key,
      ) as Object3D<Object3DEventMap>;
      if (mesh) {
        if (mesh.name.startsWith("ground")) {
          mesh.receiveShadow = true;
        }
        mesh.traverse((child) => {
          child.castShadow = true;
          if (mesh.name.startsWith("ground")) {
            child.receiveShadow = true;
          }
        });
        MeshLoader.Instance.meshes.set(key, mesh);

        mesh.position.set(0, 0, 0);

        if (
          !mesh.name.startsWith("cow") &&
          !mesh.name.startsWith("chicken") &&
          !mesh.name.startsWith("sheep")
        ) {
          mesh.matrixAutoUpdate = false;
          mesh.updateMatrix();

          mesh.traverse((child) => {
            if (child instanceof Mesh) {
              child.matrixAutoUpdate = false;
              child.updateMatrix();
            }
          });
        }
      }
    }

    for (let i = 0; i < objects.animations.length; i++) {
      const animation = objects.animations[i];
      const key = animation.name as ObjectAnimationsEnum;
      MeshLoader.Instance.animations.set(key, animation);
    }
  }

  public static createInstancedMeshFromGLTF(
    gltf: GLTF,
    maxInstances: number = 100,
  ): InstancedMesh[] {
    const instancedMeshes: InstancedMesh[] = [];

    // Key: geometry UUID + color hex to group same geometry with same color
    const meshDataMap = new Map<
      string,
      { geometry: BufferGeometry; matrices: Matrix4[] }
    >();

    // Traverse and collect mesh data, grouping by geometry+color
    gltf.scene.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const mesh = child as Mesh;
      const geometry = mesh.geometry as BufferGeometry;
      const material = mesh.material as MeshStandardMaterial;

      // Extract color from PBR material
      const color = new Color();
      if (material && material.color) {
        color.copy(material.color);
      } else {
        color.setRGB(1, 1, 1);
      }

      // Create key from geometry UUID and color
      const key = `${geometry.uuid}_${color.getHexString()}`;

      // Get world matrix
      mesh.updateWorldMatrix(true, false);
      const matrix = new Matrix4().copy(mesh.matrixWorld);

      if (!meshDataMap.has(key)) {
        // Clone geometry and bake vertex colors
        const coloredGeometry = geometry.clone();
        const vertexCount = coloredGeometry.getAttribute("position").count;
        const colorArray = new Float32Array(vertexCount * 3);

        for (let i = 0; i < vertexCount; i++) {
          colorArray[i * 3] = color.r;
          colorArray[i * 3 + 1] = color.g;
          colorArray[i * 3 + 2] = color.b;
        }

        coloredGeometry.setAttribute(
          "color",
          new BufferAttribute(colorArray, 3),
        );
        meshDataMap.set(key, { geometry: coloredGeometry, matrices: [] });
      }

      const data = meshDataMap.get(key)!;
      data.matrices.push(matrix);
    });

    // Create shared material for all instanced meshes
    const sharedMaterial = new MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0.0,
    });

    // Create instanced meshes for each unique geometry+color combination
    meshDataMap.forEach((data) => {
      const instanceCount = Math.min(data.matrices.length, maxInstances);
      const instancedMesh = new InstancedMesh(
        data.geometry,
        sharedMaterial,
        maxInstances,
      );

      // Set matrices for each instance
      for (let i = 0; i < instanceCount; i++) {
        instancedMesh.setMatrixAt(i, data.matrices[i]);
      }

      instancedMesh.count = instanceCount;
      instancedMesh.instanceMatrix.needsUpdate = true;
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;

      instancedMeshes.push(instancedMesh);
    });

    return instancedMeshes;
  }

  public static createInstancedSceneFromGLTF(
    gltf: GLTF,
    maxInstances: number = 100,
  ): Object3D {
    const scene = new Object3D();
    scene.name = gltf.scene.name + "_instanced";

    // Copy transform from original scene
    scene.position.copy(gltf.scene.position);
    scene.rotation.copy(gltf.scene.rotation);
    scene.scale.copy(gltf.scene.scale);

    // Create instanced meshes and add them to the scene
    const instancedMeshes = this.createInstancedMeshFromGLTF(
      gltf,
      maxInstances,
    );
    for (const instancedMesh of instancedMeshes) {
      scene.add(instancedMesh);
    }

    return scene;
  }

  public static createInstancedMeshFromObject3D(
    object: Object3D,
    maxInstances: number = 100,
  ): InstancedMesh | undefined {
    // Find the first mesh in the object hierarchy
    let sourceMesh: Mesh | undefined;
    object.traverse((child) => {
      if (!sourceMesh && child instanceof Mesh) {
        sourceMesh = child;
      }
    });

    if (!sourceMesh) return undefined;

    const geometry = sourceMesh.geometry as BufferGeometry;
    const material = sourceMesh.material as MeshStandardMaterial;

    // Extract color from PBR material
    const color = new Color();
    if (material && material.color) {
      color.copy(material.color);
    } else {
      color.setRGB(1, 1, 1);
    }

    // Clone geometry and bake vertex colors
    const coloredGeometry = geometry.clone();
    const vertexCount = coloredGeometry.getAttribute("position").count;
    const colorArray = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i++) {
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    coloredGeometry.setAttribute("color", new BufferAttribute(colorArray, 3));

    // Create material with vertex colors
    const instancedMaterial = new MeshStandardMaterial({
      vertexColors: true,
      roughness: 1,
      metalness: 0.0,
    });

    const instancedMesh = new InstancedMesh(
      coloredGeometry,
      instancedMaterial,
      maxInstances,
    );

    instancedMesh.count = 0;
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    instancedMesh.name = object.name + "_instanced";

    return instancedMesh;
  }
}
