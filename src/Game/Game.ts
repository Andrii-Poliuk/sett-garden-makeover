import { BatchedRenderer } from "three.quarks";
import AnimatedObject from "../Objects/AnimatedObject";
import Chicken from "../Objects/Chicken";
import Corn from "../Objects/Corn";
import Cow from "../Objects/Cow";
import Fence from "../Objects/Fence";
import Grape from "../Objects/Grape";
import Ground from "../Objects/Ground";
import PlaceableObject from "../Objects/PlaceableObject";
import Sheep from "../Objects/Sheep";
import Strawberry from "../Objects/Strawberry";
import Tomato from "../Objects/Tomato";
import GameLevel from "./GameLevel";
import TutorialLevel from "./TutorialLevel";
import GameScene from "../GameScene";
import { Object3D, PerspectiveCamera } from "three";
import CameraPosition from "./CameraPosition";
import { InteractiveArea } from "../Objects/InteractiveArea";
import UIScene from "../UI/UIScene";
import { Helpers } from "../Helpers";
import MultiStageObject from "../Objects/MultiStageObject";

export default class Game {
  private static _instance: Game;

  private createdObjects: Object3D[] = [];
  private animatedObjects: AnimatedObject[] = [];
  private placeableObjects: PlaceableObject[] = [];
  private batchRenderer: BatchedRenderer = new BatchedRenderer();

  private levels: GameLevel[] = [];
  private currentLevel: GameLevel | null = null;
  private gameScene: GameScene | null = null;
  private uiScene: UIScene | null = null;

  private cameraPositions: CameraPosition[] = [];

  private chickenGuide?: Chicken;

  private constructor() {}

  public static get instance(): Game {
    if (!Game._instance) {
      Game._instance = new Game();
    }
    return Game._instance;
  }

  public async init(gameScene: GameScene, uiScene: UIScene): Promise<void> {
    this.gameScene = gameScene;
    this.uiScene = uiScene;
   
    const chicken = new Chicken();
    await chicken.init();
    this.createdObjects.push(chicken);
    this.animatedObjects.push(chicken);
    const camera = this.getCamera();
    camera!.add(chicken);
    this.chickenGuide = chicken;
    this.toggleChickenGuide(false);
    Helpers.setupObjectGUI(chicken, "Guide");
  }

  public toggleChickenGuide(visible: boolean, left: boolean = true) {
    if (!this.chickenGuide) return;
    this.chickenGuide.visible = visible;
    if (left) {
      this.chickenGuide.position.set(-0.55,-1.05,-1.8);
      this.chickenGuide.rotation.set(-0.33,0.98,0);
    } else {
      this.chickenGuide.position.set(0.55,-1.05,-1.8);
      this.chickenGuide.rotation.set(-0.33,-0.98,0);
    }
  }

  public get GameScene(): GameScene {
    return this.gameScene!;
  }

  public get UIScene(): UIScene {
    return this.uiScene!;
  }

  public getCamera(): PerspectiveCamera | undefined {
    return this.gameScene?.camera;
  }

  public async startGame(): Promise<void> {
    const tutorialLevel = new TutorialLevel();
    tutorialLevel.init();
    this.levels.push(tutorialLevel);
    this.currentLevel = tutorialLevel;
    console.log("START GAME");
    await this.currentLevel.startLevel();
  }

  public getCurrentLevel(): GameLevel | null {
    return this.currentLevel;
  }

  public getLevels(): GameLevel[] {
    return this.levels;
  }

  public getBatchRenderer(): BatchedRenderer {
    return this.batchRenderer;
  }

  // #region Objects creation methods

  public async createCow(): Promise<Cow> {
    const cow = new Cow();
    await cow.init();
    this.createdObjects.push(cow);
    this.animatedObjects.push(cow);
    this.gameScene?.scene.add(cow);
    return cow;
  }

  public async createChicken(): Promise<Chicken> {
    const chicken = new Chicken();
    await chicken.init();
    this.createdObjects.push(chicken);
    this.animatedObjects.push(chicken);
    this.gameScene?.scene.add(chicken);
    return chicken;
  }

  public async createSheep(): Promise<Sheep> {
    const sheep = new Sheep();
    await sheep.init();
    this.createdObjects.push(sheep);
    this.animatedObjects.push(sheep);
    this.gameScene?.scene.add(sheep);
    return sheep;
  }

  public async createFence(): Promise<Fence> {
    const fence = new Fence();
    await fence.init();
    this.createdObjects.push(fence);
    this.placeableObjects.push(fence);
    this.gameScene?.scene.add(fence);
    return fence;
  }

  public async createGround(): Promise<Ground> {
    const ground = new Ground();
    await ground.init();
    this.createdObjects.push(ground);
    this.placeableObjects.push(ground);
    this.gameScene?.scene.add(ground);
    return ground;
  }

  public async createTomato(): Promise<Tomato> {
    const tomato = new Tomato();
    await tomato.init();
    this.createdObjects.push(tomato);
    this.gameScene?.scene.add(tomato);
    return tomato;
  }

  public async createGrape(): Promise<Grape> {
    const grape = new Grape();
    await grape.init();
    this.createdObjects.push(grape);
    this.gameScene?.scene.add(grape);
    return grape;
  }

  public async createStrawberry(): Promise<Strawberry> {
    const strawberry = new Strawberry();
    await strawberry.init();
    this.createdObjects.push(strawberry);
    this.gameScene?.scene.add(strawberry);
    return strawberry;
  }

  public async createCorn(): Promise<Corn> {
    const corn = new Corn();
    await corn.init();
    this.createdObjects.push(corn);
    this.gameScene?.scene.add(corn);
    return corn;
  }

  public createCameraPosition(): CameraPosition {
    const cameraPosition = new CameraPosition();
    this.createdObjects.push(cameraPosition);
    this.gameScene?.scene.add(cameraPosition);
    this.cameraPositions.push(cameraPosition);
    return cameraPosition;
  }

  public createInteractiveArea(scaleX: number = 2, scaleY: number = 2, scaleZ: number = 2): InteractiveArea {
    const interactiveArea = new InteractiveArea(scaleX, scaleY, scaleZ);
    this.createdObjects.push(interactiveArea);
    this.gameScene?.scene.add(interactiveArea);
    return interactiveArea;
  }

  public removeInteractiveArea(interactiveArea: InteractiveArea): void {
    const index = this.createdObjects.indexOf(interactiveArea);
    if (index !== -1) {
      this.createdObjects.splice(index, 1);
    }
    this.gameScene?.scene.remove(interactiveArea);
    interactiveArea.disableInteractiveArea();
  }

  public destroyMultiStageObject(object: MultiStageObject): void {
    const index = this.createdObjects.indexOf(object);
    if (index !== -1) {
      this.createdObjects.splice(index, 1);
    }
    this.gameScene?.scene.remove(object);
    object.destroy();
  }

  // #endregion

  public update(delta: number): void {
    this.animatedObjects.forEach((object) => {
      object.update(delta);
    });
    this.placeableObjects.forEach((object) => {
      object.update(delta);
    });
    this.levels.forEach((object) => {
      object.update(delta);
    });
    this.cameraPositions.forEach((object) => {
      object.update();
    });

    this.batchRenderer.update(delta);
  }
}
