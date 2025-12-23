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
      this.createInstancedSceneFromGLTF(ground, 200,
        ["hay",
        "bush",
        "ground",
        "fence",
        "milk",
        "pumpkin",
        "tree",
        "ambar",
        "storage"],
 ["ambar",
        "hay",
        "ground","terrain"],
        ["terrain"]
      );

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
    castShadowFilter?: string[],
    receiveShadowFilter?: string[],
    singleChildFilter?: string[],
  ): InstancedMesh[] {
    const instancedMeshes: InstancedMesh[] = [];

    // 4 batches based on shadow interaction:
    // 0: no shadows (no cast, no receive)
    // 1: cast only
    // 2: receive only
    // 3: cast and receive
    type ShadowBatch = 0 | 1 | 2 | 3;

    // Key: geometry UUID + color hex + shadow batch to group same geometry with same color and shadow settings
    const meshDataMap = new Map<
      string,
      {
        geometry: BufferGeometry;
        matrices: Matrix4[];
        shadowBatch: ShadowBatch;
      }
    >();

    // Helper to determine shadow batch
    const getShadowBatch = (castShadow: boolean, receiveShadow: boolean): ShadowBatch => {
      if (!castShadow && !receiveShadow) return 0;
      if (castShadow && !receiveShadow) return 1;
      if (!castShadow && receiveShadow) return 2;
      return 3;
    };

    // Check if mesh or any of its ancestors match the filter
    const matchesFilter = (obj: Object3D, prefixes: string[]): boolean => {
      let current: Object3D | null = obj;
      while (current) {
        if (prefixes.some((prefix) => current!.name.startsWith(prefix))) {
          return true;
        }
        current = current.parent;
      }
      return false;
    };

    // Check if mesh should be skipped due to singleChildFilter
    // Returns true if mesh should be skipped (is not first child of a matching parent)
    const shouldSkipForSingleChild = (obj: Object3D, prefixes: string[]): boolean => {
      let current: Object3D | null = obj.parent;
      let child: Object3D = obj;
      while (current) {
        if (prefixes.some((prefix) => current!.name.startsWith(prefix))) {
          // Found matching parent, check if child is first
          return current.children.indexOf(child) !== 0;
        }
        child = current;
        current = current.parent;
      }
      return false;
    };

    // Traverse and collect mesh data, grouping by geometry+color+shadowBatch
    gltf.scene.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const mesh = child as Mesh;

      // Skip if not first child of a singleChildFilter matching parent
      if (singleChildFilter && shouldSkipForSingleChild(mesh, singleChildFilter)) {
        return;
      }
      const geometry = mesh.geometry as BufferGeometry;
      const material = mesh.material as MeshStandardMaterial;

      // Extract color from PBR material
      const color = new Color();
      if (material && material.color) {
        color.copy(material.color);
      } else {
        color.setRGB(1, 1, 1);
      }

      // Determine shadow settings based on filters
      const castShadow = castShadowFilter
        ? matchesFilter(mesh, castShadowFilter)
        : true;
      const receiveShadow = receiveShadowFilter
        ? matchesFilter(mesh, receiveShadowFilter)
        : true;
      const shadowBatch = getShadowBatch(castShadow, receiveShadow);

      // Create key from geometry UUID, color, and shadow batch
      const key = `${geometry.uuid}_${color.getHexString()}_${shadowBatch}`;

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

        meshDataMap.set(key, {
          geometry: coloredGeometry,
          matrices: [],
          shadowBatch,
        });
      }

      const data = meshDataMap.get(key)!;
      data.matrices.push(matrix);
    });

    // Create 4 shared materials for each shadow batch (allows renderer to batch by material)
    const sharedMaterials: MeshStandardMaterial[] = [];
    for (let i = 0; i < 4; i++) {
      sharedMaterials.push(
        new MeshStandardMaterial({
          vertexColors: true,
          roughness: 1,
          metalness: 0.0,
        }),
      );
    }

    // Create instanced meshes for each unique geometry+color+shadowBatch combination
    meshDataMap.forEach((data) => {
      const instanceCount = Math.min(data.matrices.length, maxInstances);
      const instancedMesh = new InstancedMesh(
        data.geometry,
        sharedMaterials[data.shadowBatch],
        maxInstances,
      );

      // Set matrices for each instance
      for (let i = 0; i < instanceCount; i++) {
        instancedMesh.setMatrixAt(i, data.matrices[i]);
      }

      instancedMesh.count = instanceCount;
      instancedMesh.instanceMatrix.needsUpdate = true;

      // Set shadow properties based on batch
      instancedMesh.castShadow = data.shadowBatch === 1 || data.shadowBatch === 3;
      instancedMesh.receiveShadow = data.shadowBatch === 2 || data.shadowBatch === 3;

      instancedMeshes.push(instancedMesh);
    });

    return instancedMeshes;
  }

  public static createInstancedSceneFromGLTF(
    gltf: GLTF,
    maxInstances: number = 100,
    castShadowFilter?: string[],
    receiveShadowFilter?: string[],
    singleChildFilter?: string[]
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
      castShadowFilter,
      receiveShadowFilter,
      singleChildFilter,
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
