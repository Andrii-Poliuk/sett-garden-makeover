import { BatchedRenderer } from "three.quarks";
import Chicken from "../Objects/Chicken";
import Corn from "../Objects/Corn";
import Cow from "../Objects/Cow";
import Fence from "../Objects/Fence";
import Grape from "../Objects/Grape";
import Ground from "../Objects/Ground";
import Sheep from "../Objects/Sheep";
import Strawberry from "../Objects/Strawberry";
import Tomato from "../Objects/Tomato";
import GameLevel from "./GameLevel";
import TutorialLevel from "./TutorialLevel";
import GameScene from "./GameScene";
import { PerspectiveCamera } from "three";
import CameraPosition from "./CameraPosition";
import DayNightController from "./DayNightController";
import { InteractiveArea } from "../Objects/InteractiveArea";
import UIScene from "../UI/UIScene";
import MultiStageObject from "../Objects/MultiStageObject";
import AnimatedObject from "../Objects/AnimatedObject";
import MainLevel from "./MainLevel";
import PixiAssetsLoader, { SoundAsset } from "./PixiAssetsLoader";
// import { Helpers } from "../Helpers";

export enum CropType {
  Corn,
  Grape,
  Strawberry,
  Tomato,
}

export enum CattleType {
  Chicken,
  Cow,
  Sheep,
}

export enum LandType {
  Fence,
  Ground,
}

export default class Game {
  private static _instance: Game;

  private interactiveAreas: InteractiveArea[] = [];
  private cattle: AnimatedObject[] = [];
  private crops: MultiStageObject[] = [];
  private fences: Fence[] = [];
  private grounds: Ground[] = [];

  private batchRenderer: BatchedRenderer = new BatchedRenderer();

  // private levels: GameLevel[] = [];
  private currentLevel: GameLevel | null = null;
  private gameScene: GameScene | null = null;
  private uiScene: UIScene | null = null;
  private dayNightControllerInstance: DayNightController | null = null;

  private cameraPositions: CameraPosition[] = [];

  private chickenGuide?: Chicken;

  private moneyValue: number = 0;

  public get money(): number {
    return this.moneyValue;
  }

  public set money(value: number) {
    this.moneyValue = value;
    if (this.moneyValue < 0) {
      this.moneyValue = 0;
    }
    this.uiScene?.gameControls.setMoney(this.moneyValue);
  }

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
    this.dayNightControllerInstance = new DayNightController(gameScene);
    this.dayNightController.setDay();
    // Helpers.setupDayNightGUI(this.dayNightController);

    const chicken = new Chicken();
    await chicken.init();
    const camera = this.getCamera();
    camera!.add(chicken);
    this.chickenGuide = chicken;
    this.chickenGuide.traverse((child) => {
      child.castShadow = false;
      child.receiveShadow = false;
    });
    this.toggleChickenGuide(false);
  }

  public toggleChickenGuide(visible: boolean, left: boolean = true): void {
    if (!this.chickenGuide) return;
    this.chickenGuide.visible = visible;
    if (left) {
      this.chickenGuide.position.set(-0.55, -1.05, -1.8);
      this.chickenGuide.rotation.set(-0.33, 0.98, 0);
    } else {
      this.chickenGuide.position.set(0.55, -1.05, -1.8);
      this.chickenGuide.rotation.set(-0.33, -0.98, 0);
    }
    if (visible) {
      PixiAssetsLoader.instance.playSound(SoundAsset.Chicken);
    }
  }

  public get GameScene(): GameScene {
    return this.gameScene!;
  }

  public get UIScene(): UIScene {
    return this.uiScene!;
  }

  public get dayNightController(): DayNightController {
    return this.dayNightControllerInstance!;
  }

  public getCattle(): AnimatedObject[] {
    return this.cattle;
  }

  public getCrops(): MultiStageObject[] {
    return this.crops;
  }

  public getFences(): Fence[] {
    return this.fences;
  }

  public getGrounds(): Ground[] {
    return this.grounds;
  }

  public getCamera(): PerspectiveCamera | undefined {
    return this.gameScene?.camera;
  }

  public getCameraPositions(): CameraPosition[] | undefined {
    return this.cameraPositions;
  }

  public async startGame(): Promise<void> {
    // return;
    PixiAssetsLoader.instance.playSound(SoundAsset.Theme, 0.2, true);

    const tutorialLevel = new TutorialLevel();
    tutorialLevel.init();
    const mainLevel = new MainLevel();
    mainLevel.init();

    this.money = 50000;

    // TODO: remove
    // this.currentLevel = mainLevel;
    // await mainLevel.startLevel();
    //   return;
    //<<<<<<<<<<<<<<<<<<

    tutorialLevel.onLevelFinished = async () => {
      this.currentLevel = mainLevel;
      await mainLevel.startLevel();
    };
    this.currentLevel = tutorialLevel;
    await tutorialLevel.startLevel();
    // this.levels.push(tutorialLevel);
    // await this.currentLevel.startLevel();
  }

  public resetGame(): void {
    this.interactiveAreas.forEach((area) => {
      area.disableInteractiveArea();
      this.gameScene?.scene.remove(area);
    });
    this.interactiveAreas = [];

    this.cattle.forEach((animal) => {
      animal.destroy();
      this.gameScene?.scene.remove(animal);
    });
    this.cattle = [];

    this.crops.forEach((crop) => {
      crop.destroy();
      this.gameScene?.scene.remove(crop);
    });
    this.crops = [];

    this.fences.forEach((fence) => {
      fence.destroy();
      this.gameScene?.scene.remove(fence);
    });
    this.fences = [];

    this.grounds.forEach((ground) => {
      ground.destroy();
      this.gameScene?.scene.remove(ground);
    });
    this.grounds = [];

    this.cameraPositions.forEach((cameraPosition) => {
      this.gameScene?.scene.remove(cameraPosition);
    });
    this.cameraPositions = [];

    this.currentLevel = null;
  }

  public getBatchRenderer(): BatchedRenderer {
    return this.batchRenderer;
  }

  // #region Objects creation methods

  public async createCow(): Promise<Cow> {
    const cow = new Cow();
    await cow.init();
    this.cattle.push(cow);
    this.gameScene?.scene.add(cow);
    return cow;
  }

  public async createChicken(): Promise<Chicken> {
    const chicken = new Chicken();
    await chicken.init();
    this.cattle.push(chicken);
    this.gameScene?.scene.add(chicken);
    return chicken;
  }

  public async createSheep(): Promise<Sheep> {
    const sheep = new Sheep();
    await sheep.init();
    this.cattle.push(sheep);
    this.gameScene?.scene.add(sheep);
    return sheep;
  }

  public async createFence(): Promise<Fence> {
    const fence = new Fence();
    await fence.init();
    this.fences.push(fence);
    this.gameScene?.scene.add(fence);
    return fence;
  }

  public async createGround(): Promise<Ground> {
    const ground = new Ground();
    await ground.init();
    this.grounds.push(ground);
    this.gameScene?.scene.add(ground);
    return ground;
  }

  public async createTomato(): Promise<Tomato> {
    const tomato = new Tomato();
    await tomato.init();
    this.crops.push(tomato);
    this.gameScene?.scene.add(tomato);
    return tomato;
  }

  public async createGrape(): Promise<Grape> {
    const grape = new Grape();
    await grape.init();
    this.crops.push(grape);
    this.gameScene?.scene.add(grape);
    return grape;
  }

  public async createStrawberry(): Promise<Strawberry> {
    const strawberry = new Strawberry();
    await strawberry.init();
    this.crops.push(strawberry);
    this.gameScene?.scene.add(strawberry);
    return strawberry;
  }

  public async createCorn(): Promise<Corn> {
    const corn = new Corn();
    await corn.init();
    this.crops.push(corn);
    this.gameScene?.scene.add(corn);
    return corn;
  }

  public createCameraPosition(): CameraPosition {
    const cameraPosition = new CameraPosition();
    this.gameScene?.scene.add(cameraPosition);
    this.cameraPositions.push(cameraPosition);
    return cameraPosition;
  }

  public createInteractiveArea(
    scaleX: number = 2,
    scaleY: number = 2,
    scaleZ: number = 2,
  ): InteractiveArea {
    const interactiveArea = new InteractiveArea(scaleX, scaleY, scaleZ);
    this.interactiveAreas.push(interactiveArea);
    this.gameScene?.scene.add(interactiveArea);
    return interactiveArea;
  }

  public removeInteractiveArea(interactiveArea: InteractiveArea): void {
    const index = this.interactiveAreas.indexOf(interactiveArea);
    if (index !== -1) {
      this.interactiveAreas.splice(index, 1);
    }
    this.gameScene?.scene.remove(interactiveArea);
    interactiveArea.disableInteractiveArea();
  }

  public destroyMultiStageObject(object: MultiStageObject): void {
    const index = this.crops.indexOf(object);
    if (index !== -1) {
      this.crops.splice(index, 1);
    }
    this.gameScene?.scene.remove(object);
    object.destroy();
  }

  public removeCameraPosition(cameraPosition: CameraPosition): void {
    const index = this.cameraPositions.indexOf(cameraPosition);
    if (index !== -1) {
      this.cameraPositions.splice(index, 1);
    }
    this.gameScene?.scene.remove(cameraPosition);
  }

  // #endregion

  public update(delta: number): void {
    this.chickenGuide?.update(delta);

    this.cattle.forEach((object) => {
      object.update(delta);
    });
    this.crops.forEach((object) => {
      object.update(delta);
    });
    this.fences.forEach((object) => {
      object.update(delta);
    });
    this.grounds.forEach((object) => {
      object.update(delta);
    });
    this.interactiveAreas.forEach((object) => {
      object.update(delta);
    });
    this.currentLevel?.update(delta);
    this.cameraPositions.forEach((object) => {
      object.update();
    });

    this.batchRenderer.update(delta);
  }
}
