import { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import * as THREE from "three";
import MeshLoader from "./Objects/MeshLoader";
import Cow from "./Objects/Cow";
import AnimatedObject from "./Objects/AnimatedObject";
import ObjectHighlight from "./Objects/ObjectHighlight";
import { ObjectsMeshEnum } from "./Objects/ObjectsMeshEnum";
import Fence from "./Objects/Fence";
import { setupOrbitControls, Helpers } from "./Helpers";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import PlaceableObject from "./Objects/PlaceableObject";
import { RaycastManager } from "./RaycastManager";
import Game from "./Game/Game";
import { InteractiveArea } from "./Objects/InteractiveArea";

export default class GameScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;

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
    this.controls = setupOrbitControls(threeCamera, renderer);

    const environmentTexture = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
    scene.environment = environmentTexture
    scene.background = environmentTexture
  }

  public async init() {
    RaycastManager.instance.init(this.renderer, this.camera);

    await MeshLoader.loadModelsAsync();
    const farm = MeshLoader.getScene();
    farm.position.set(0, -4.5, 0);
    this.scene.add(farm);

    this.scene.add(Game.instance.getBatchRenderer());
    // this.scene.add(MeshLoader.Instance.objects!.scene);

    // const ambientLight = new THREE.AmbientLight(0xffffff, Math.PI);
    // this.scene.add(ambientLight);

    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public update(delta: number): void {
    this.controls.update();
  }
}
