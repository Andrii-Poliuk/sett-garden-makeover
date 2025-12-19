import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import * as THREE from "three";
import MeshLoader from "../Objects/MeshLoader";
// import { setupOrbitControls } from "../Helpers";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RaycastManager } from "./RaycastManager";
import Game from "./Game";

export default class GameScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  // controls: OrbitControls;
  ambientLight?: THREE.AmbientLight;

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
    scene.add(threeCamera);
    this.renderer = renderer;
    // this.controls = setupOrbitControls(threeCamera, renderer);

    scene.background = new THREE.Color(0.3, 0.5, 1);
  }

  public async init() {
    RaycastManager.instance.init(this.renderer, this.camera);

    await MeshLoader.loadModelsAsync();
    const farm = MeshLoader.getScene();
    farm.position.set(0, -4.5, 0);
    this.scene.add(farm);

    this.scene.add(Game.instance.getBatchRenderer());

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(this.ambientLight);
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public update(_delta: number): void {
    // this.controls.update();
  }

  public setEnvironmentColors(
    lightR: number,
    lightG: number,
    lightB: number,
    lightIntensity: number,
    skyR: number,
    skyG: number,
    skyB: number,
  ): void {
    if (this.ambientLight) {
      this.ambientLight.color.setRGB(lightR, lightG, lightB);
      this.ambientLight.intensity = lightIntensity;
    }
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.setRGB(skyR, skyG, skyB);
    }
  }
}
