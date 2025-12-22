import { Object3D, Vector3 } from "three";
import DialogPopup from "../UI/Popups/DialogPopup";
import Sheep from "../Objects/Sheep";
import CameraPosition, { CameraPositionData } from "./CameraPosition";
import Game from "./Game";
import GameLevel from "./GameLevel";
import Ground from "../Objects/Ground";
import Fence from "../Objects/Fence";
import { InteractiveArea } from "../Objects/InteractiveArea";
import { ObjectsMeshEnum } from "../Objects/ObjectsMeshEnum";
import ObjectHighlight from "../Objects/ObjectHighlight";
import Corn from "../Objects/Corn";
import HomeMenu from "../UI/Menu/HomeMenu";
import LandPlacementMenu from "../UI/Menu/LandPlacementMenu";
import MoneyCost, { MoneyCostType } from "./MoneyCost";
import GameControls from "../UI/Menu/GameControls";
import FloatingText from "../Particles/FloatingText";
import PixiAssetsLoader, { SoundAsset } from "./PixiAssetsLoader";
import SoundSource from "../Objects/SoundSource";

export default class TutorialLevel extends GameLevel {
  private cameraPosition?: CameraPosition;
  private sheep?: Sheep;
  private ground?: Ground;
  private fence?: Fence;
  private targetFence?: InteractiveArea | null;
  private targetSheep?: InteractiveArea | null;
  private gameQuestResolved?: () => void;
  private corn: Corn[] = [];

  private tickingDamage: number = 0;
  private damageTick: number = 3.0;
  private damageTimer: number = 0;

  constructor() {
    super();
  }

  public init(): void {
    super.init();

    const cameraPosition = Game.instance.getCamera()!.position;
    this.cameraPosition = Game.instance.createCameraPosition();
    this.cameraPosition.updatePosition({
      position: new Vector3(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
      ),
      target: new Vector3(0, -1, -1),
    });
    this.cameraPosition.snapCamera(Game.instance.getCamera()!);
    // Helpers.setupCameraPositionGUI(this.cameraPosition);
  }

  public override async startLevel(): Promise<void> {
    await super.startLevel();

    await this.farmSetup();
    await this.playFarmTour();

    await this.playSheepEncounter();

    await this.playCropHarvesting();

    await this.playFinalWords();

    await this.finishLevel();
  }

  private async playFinalWords() {
    const cameraFarmFarView: CameraPositionData = {
      position: new Vector3(-9.1, 30, 23.4),
      target: new Vector3(3.8, -18, -13.4),
    };
    this.cameraPosition!.updatePosition(cameraFarmFarView);
    this.cameraPosition!.lerpSpeed = 0.02;

    Game.instance.toggleChickenGuide(true, true);
    await DialogPopup.instance.showPopup(
      "Good job!\nYou can coninue without henholding",
    );
    Game.instance.UIScene.showGameControls(GameControls.SKIP_DAY);
    await DialogPopup.instance.showPopup(
      "You can rest till morning\nby pressing Next Day button.\nOr plant more Crops",
    );
    await DialogPopup.instance.showPopup(
      "Crops take 2 nights to mature.\nIf you get enough Cattle to cover Rent\nconsider your problems solved",
    );
    await DialogPopup.instance.showPopup(
      "Be wary of Rent pay every morning\nIt was 300 greens I believe?\nGood luck!",
    );
    Game.instance.toggleChickenGuide(false);
  }

  private async playCropHarvesting() {
    const cameraCropHarvestPosition: CameraPositionData = {
      position: new Vector3(0, 18.2, 12.3),
      target: new Vector3(5.3, -10.5, -7),
    };
    this.cameraPosition!.updatePosition(cameraCropHarvestPosition);

    await DialogPopup.instance.showPopup(
      "Now, when the Sheep's put in place,\nyou can collect what's\nleft of your Harvest",
    );
    Game.instance.toggleChickenGuide(false);

    this.corn.forEach((corn) => {
      corn.enableInteraction(async (_obj) => {
        this.collectCorn(corn);
        PixiAssetsLoader.instance.playSound(SoundAsset.Click);
      });
    });

    await new Promise<void>((resolve) => {
      this.gameQuestResolved = resolve;
    });
  }

  private async playSheepEncounter() {
    const cameraStartPosition: CameraPositionData = {
      position: new Vector3(0, 10.5, 14.5),
      target: new Vector3(-10, -10.5, -7),
    };
    this.cameraPosition!.lerpSpeed = 0.03;
    this.cameraPosition!.updatePosition(cameraStartPosition);

    await DialogPopup.instance.showPopup("Oh no... Your sheep has run amok!");

    const sheepSound = new SoundSource({
            sound: SoundAsset.Sheep,
            minInterval: 3,
            maxInterval: 10,
            volume: 0.4,
          });
    this.sheep!.soundSource = sheepSound;
    sheepSound.start();

    Game.instance.UIScene.showGameControls(GameControls.MONEY);
    this.tickingDamage = MoneyCost[MoneyCostType.SheepDamage];

    await DialogPopup.instance.showPopup(
      "And it's already causing damage\nPlace a fence, quick!",
    );
    Game.instance.toggleChickenGuide(false);

    Game.instance.UIScene.showHomeMenu();
    Game.instance.UIScene.homeMenu.setEnabled(false);
    Game.instance.UIScene.homeMenu.setEnabled(true, HomeMenu.LAND);
    Game.instance.UIScene.landPlacementMenu.setEnabled(false);
    Game.instance.UIScene.landPlacementMenu.setEnabled(
      true,
      LandPlacementMenu.CATTLE_PEN,
    );
    Game.instance.UIScene.landPlacementMenu.onCattlePenClick = () => {
      this.createFencePlacement();
      Game.instance.UIScene.landPlacementMenu.onCattlePenClick = undefined;
      Game.instance.UIScene.landPlacementMenu.setEnabled(false);
    };

    await new Promise<void>((resolve) => {
      this.gameQuestResolved = resolve;
    });

    this.targetSheep = await Game.instance.createInteractiveArea();
    const interactiveAreas = this.fence!.getInteractiveAreas();
    const area = interactiveAreas[1];
    const position = area.getWorldPosition(new Vector3());
    this.targetSheep?.position.set(position.x, 0, position.z);
    this.targetSheep?.rotation.set(0, area.rotation.y, 0);
    const sheepHighlight = new ObjectHighlight();
    await sheepHighlight.init(ObjectsMeshEnum.Sheep);
    this.targetSheep.enableInteractiveArea(sheepHighlight, async (sender) => {
      sheepSound.stop();
      sheepSound.minInterval = 15;
      sheepSound.maxInterval = 90;
      sheepSound.start();
      await this.placeSheep(sender);
      this.targetSheep?.disableInteractiveArea();
      Game.instance.removeInteractiveArea(this.targetSheep!);
      this.targetSheep = null;
      this.gameQuestResolved?.();
    });

    await new Promise<void>((resolve) => {
      this.gameQuestResolved = resolve;
    });

    this.tickingDamage = 0;

    Game.instance.UIScene.showHomeMenu();
    Game.instance.UIScene.homeMenu.setEnabled(false);

    Game.instance.toggleChickenGuide(true, false);
    await DialogPopup.instance.showPopup(
      "Cattle in the Pens provide income every morning",
    );
  }

  private async playFarmTour() {
    const cameraFarmOverview: CameraPositionData = {
      position: new Vector3(0, 14.5, 22),
      target: new Vector3(0, -18, -20),
    };
    this.cameraPosition!.updatePosition(cameraFarmOverview);
    this.cameraPosition!.lerpSpeed = 0.01;

    Game.instance.toggleChickenGuide(true, true);
    await DialogPopup.instance.showPopup(
      "This is your Farm!\nSmall but cozy\nHowever...",
    );
    await DialogPopup.instance.showPopup(
      "You still have to pay the rent\nand it could use\nsome management",
    );

    const cameraCornView: CameraPositionData = {
      position: new Vector3(-3.9, 10.1, 3.5),
      target: new Vector3(20, -12.9, -4.6),
    };
    this.cameraPosition!.lerpSpeed = 0.015;
    this.cameraPosition!.updatePosition(cameraCornView);
    Game.instance.toggleChickenGuide(true, false);
    await DialogPopup.instance.showPopup(
      "You've already got some grown Corn\nready to be picked for profit",
    );

    const cameraChickenView: CameraPositionData = {
      position: new Vector3(2, 8.6, -3.2),
      target: new Vector3(12.6, -18.6, -7),
    };
    this.cameraPosition!.lerpSpeed = 0.015;
    this.cameraPosition!.updatePosition(cameraChickenView);
    await DialogPopup.instance.showPopup(
      "Animals are the source of daily income.\nIn your Fence already placed\nChickens and a Sheep",
    );
    await DialogPopup.instance.showPopup("By the way... Where's...");
  }

  private async farmSetup() {
    this.ground = await Game.instance.createGround();
    this.ground.position.set(10, 0, 0);
    this.ground.rotation.set(0, Math.PI / 2, 0);

    const groundLocations = this.ground.getInteractiveAreas();
    for (let i = 0; i < groundLocations.length; i++) {
      const area = groundLocations[i];
      const position = area.getWorldPosition(new Vector3());
      const corn = await Game.instance.createCorn();
      corn.position.set(position.x, position.y, position.z);
      corn.setStage3();
      this.corn.push(corn);
      corn.placedAtArea = area;
    }

    const chickenLocations = [
      { x: 12.4, z: -8.7, r: Math.PI },
      { x: 9.9, z: -5, r: -Math.PI / 4 },
      { x: 9, z: -7, r: Math.PI * 1.2 },
    ];
    for (let i = 0; i < 3; i++) {
      const chicken = await Game.instance.createChicken();
      const location = chickenLocations[i];
      chicken.position.set(location.x, -0.28, location.z);
      chicken.rotation.set(0, location.r, 0);
      if (i == 0) {
        chicken.playAction();
      }
      const soundSource = new SoundSource({
              sound: SoundAsset.Chicken,
              minInterval: 30,
              maxInterval: 120,
              volume: 0.2,
            });
      chicken.soundSource  = soundSource;
      soundSource.start();
    }

    this.sheep = await Game.instance.createSheep();
    this.sheep.position.set(-8.2, 0, 8.05);
    this.sheep.rotation.set(0, 0.36, 0);
    this.sheep.playAction();
  }

  private async collectCorn(corn: Corn) {
    const income = MoneyCost[MoneyCostType.CornHarvest];
    const cornPosition = corn.getWorldPosition(new Vector3());
    FloatingText.playEffect(income, cornPosition);
    Game.instance.money += income;
    const index = this.corn.indexOf(corn);
    this.corn.splice(index, 1);
    await corn.playEffect();
    Game.instance.destroyMultiStageObject(corn);
    if (this.corn.length <= 0) {
      this.gameQuestResolved?.();
    }
  }

  private async createFencePlacement() {
    this.targetFence = await Game.instance.createInteractiveArea(6, 2, 10);
    this.targetFence.position.set(-10, 0, -3.25);
    this.targetFence.rotation.set(0, Math.PI / 2, 0);
    const fenceHighlight = new ObjectHighlight();
    await fenceHighlight.init(ObjectsMeshEnum.Fence);
    this.targetFence.enableInteractiveArea(fenceHighlight, async (sender) => {
      this.placeFence(sender);
      this.targetFence?.disableInteractiveArea();
      Game.instance.removeInteractiveArea(this.targetFence!);
      this.targetFence = null;
    });

    const cameraShowFencePosition: CameraPositionData = {
      position: new Vector3(-1, 10.5, 17.5),
      target: new Vector3(-7.5, -10.5, -16),
    };
    this.cameraPosition?.updatePosition(cameraShowFencePosition);
  }

  private placeSheep(location: Object3D) {
    this.sheep?.position.set(location.position.x, 0, location.position.z);
    this.sheep?.rotation.set(0, location.rotation.y, 0);
    this.sheep?.playIdle();
    const interactiveAreas = this.fence!.getInteractiveAreas();
    interactiveAreas[1].blocked = true;
    this.sheep?.playEffect();
    PixiAssetsLoader.instance.playSound(SoundAsset.Sheep);
  }

  private async placeFence(location: Object3D) {
    this.fence = await Game.instance.createFence();
    this.fence.rotation.set(0, location.rotation.y, 0);
    this.fence.position.set(
      location.position.x,
      location.position.y,
      location.position.z,
    );
    this.gameQuestResolved?.();
  }

  public override async finishLevel(): Promise<void> {
    await super.finishLevel();

    Game.instance.UIScene.homeMenu.setEnabled(true);
    Game.instance.UIScene.cattlePlacementMenu.setEnabled(true);
    Game.instance.UIScene.cropPlacementMenu.setEnabled(true);
    Game.instance.UIScene.landPlacementMenu.setEnabled(true);

    if (this.cameraPosition) {
      Game.instance.removeCameraPosition(this.cameraPosition);
      this.cameraPosition = undefined;
    }
  }

  public override update(delta: number): void {
    super.update(delta);
    this.targetFence?.update(delta);
    this.targetSheep?.update(delta);

    this.damageTimer += delta;
    if (this.damageTimer > this.damageTick && this.tickingDamage !== 0) {
      this.damageTimer = 0;
      Game.instance.money += this.tickingDamage;
      if (this.sheep) {
        const sheepPosition = this.sheep.getWorldPosition(new Vector3());
        FloatingText.playEffect(this.tickingDamage, sheepPosition);
        PixiAssetsLoader.instance.playSound(SoundAsset.ThrowSpear);
      }
    }
  }
}
