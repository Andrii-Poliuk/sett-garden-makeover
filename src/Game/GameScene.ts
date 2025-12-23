import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import * as THREE from "three";
import MeshLoader from "../Objects/MeshLoader";
// import { setupOrbitControls } from "../Helpers";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RaycastManager } from "./RaycastManager";
import Game from "./Game";
// import { Helpers } from "../Helpers";

export default class GameScene {
  public scene: Scene;
  public camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  // private controls: OrbitControls;
  private ambientLight?: THREE.AmbientLight;
  private directionalLight?: THREE.DirectionalLight;

  constructor(renderer: WebGLRenderer) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    this.scene = scene;
    const threeCamera = new THREE.PerspectiveCamera(70, width / height);
    this.camera = threeCamera;
    threeCamera.position.z = 10;
    threeCamera.position.y = 10;
    threeCamera.lookAt(new THREE.Vector3(0, 0, 0));
    threeCamera.fov = 70;
    threeCamera.near = 1;
    threeCamera.far = 90;
    scene.add(threeCamera);
    this.renderer = renderer;
    // this.controls = setupOrbitControls(threeCamera, renderer);

    scene.background = new THREE.Color(0.3, 0.5, 1);
    scene.environmentIntensity = 0;
  }

  public async init(): Promise<void> {
    RaycastManager.instance.init(this.renderer, this.camera);

    await MeshLoader.loadModelsAsync();
    const farm = MeshLoader.getGroundInstancedScene();
    if (farm) {
      farm.position.set(0, -4.5, 0);
      this.scene.add(farm);
    }

    this.scene.add(Game.instance.getBatchRenderer());

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.target.position.set(0, 0, 0);
    this.directionalLight.position.set(10, 10, 10);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight.target);
    // this.directionalLight.shadow.mapSize.width = 2048;
    // this.directionalLight.shadow.mapSize.height = 2048;
    // this.directionalLight.shadow.mapSize.width = 1024;
    // this.directionalLight.shadow.mapSize.height = 1024;
    this.directionalLight.shadow.mapSize.width = 512;
    this.directionalLight.shadow.mapSize.height = 512;
    // this.directionalLight.shadow.radius = 4;
    this.directionalLight.shadow.bias = -0.001;
    this.directionalLight.shadow.camera.near = 8;
    this.directionalLight.shadow.camera.far = 70;
    this.directionalLight.shadow.camera.left = -22;
    this.directionalLight.shadow.camera.right = 25;
    this.directionalLight.shadow.camera.top = 25;
    this.directionalLight.shadow.camera.bottom = -20;
    this.directionalLight.shadow.camera.updateProjectionMatrix();
    this.scene.add(this.directionalLight);

    // Helpers.setupDirectionalLightGUI(this.directionalLight, this.ambientLight, "Light");
  }

  private static readonly baseFov = 60;
  private static readonly maxFov = 90;
  private static readonly aspectThreshold = 0.7;
  private static readonly aspectMin = 0.4;

  public resize(width: number, height: number): void {
    const aspect = width / height;
    this.camera.aspect = aspect;

    if (aspect < GameScene.aspectThreshold) {
      const t = Math.max(
        0,
        (GameScene.aspectThreshold - aspect) /
          (GameScene.aspectThreshold - GameScene.aspectMin),
      );
      this.camera.fov =
        GameScene.baseFov +
        (GameScene.maxFov - GameScene.baseFov) * Math.min(t, 1);
    } else {
      this.camera.fov = GameScene.baseFov;
    }

    this.camera.updateProjectionMatrix();
  }

  public update(_delta: number): void {
    // this.controls.update();
    this.directionalLight?.lookAt(0, 0, 0);
  }

  public setEnvironmentColors(
    lightR: number,
    lightG: number,
    lightB: number,
    lightIntensity: number,
    skyR: number,
    skyG: number,
    skyB: number,
    dirLightR: number,
    dirLightG: number,
    dirLightB: number,
    dirLightIntensity: number,
    dirLightX: number,
    dirLightY: number,
    dirLightZ: number,
  ): void {
    if (this.ambientLight) {
      this.ambientLight.color.setRGB(lightR, lightG, lightB);
      this.ambientLight.intensity = lightIntensity;
    }
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.setRGB(skyR, skyG, skyB);
    }
    if (this.directionalLight) {
      this.directionalLight.color.setRGB(dirLightR, dirLightG, dirLightB);
      this.directionalLight.intensity = dirLightIntensity;
      this.directionalLight.position.set(dirLightX, dirLightY, dirLightZ);
    }
  }
}
