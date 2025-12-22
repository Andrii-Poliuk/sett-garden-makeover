import { Object3D, Quaternion, Vector3 } from "three";
import { InteractiveArea } from "../Objects/InteractiveArea";
import ObjectHighlight from "../Objects/ObjectHighlight";
import { ObjectsMeshEnum } from "../Objects/ObjectsMeshEnum";
import PlaceableObject from "../Objects/PlaceableObject";
import Game, { CropType, CattleType, LandType } from "./Game";
import GameLevel from "./GameLevel";
import LandPlacementMenu from "../UI/Menu/LandPlacementMenu";
import HomeMenu from "../UI/Menu/HomeMenu";
import ConfirmationPopup from "../UI/Popups/ConfirmationPopup";
import DialogPopup from "../UI/Popups/DialogPopup";
import MultiStageObject from "../Objects/MultiStageObject";
import MoneyCost, { MoneyCostType } from "./MoneyCost";
import FloatingText from "../Particles/FloatingText";
import PixiAssetsLoader, { SoundAsset } from "./PixiAssetsLoader";
import AnimatedObject from "../Objects/AnimatedObject";
import SoundSource from "../Objects/SoundSource";
import GameOverPopup from "../UI/Popups/GameOverPopup";
import CameraPosition from "./CameraPosition";

export default class MainLevel extends GameLevel {
  private landPlacements: InteractiveArea[] = [];
  private cameraPosition?: CameraPosition;

  private static readonly rentMessages: string[] = [
    "Rent Time!",
    "Time to pay the rent!",
    "Rent is due!",
    "Pay Day! It's everyday..",
  ];

  constructor() {
    super();
  }

  public init(): void {}

  public async startLevel(): Promise<void> {
    this.bindUI();
    this.createLandPlacementPoints();

    Game.instance.UIScene.showHomeMenu();
    Game.instance.UIScene.showGameControls();
    Game.instance.UIScene.gameControls.setEnabled(true);

    this.cameraPosition = Game.instance.createCameraPosition();
    this.cameraPosition.updatePosition({
      position: new Vector3(-22.4, 22.6, 10.1),
      target: new Vector3(9.2, -10, -4.1),
    });
    this.cameraPosition.snapCamera(Game.instance.getCamera()!);
  }

  public async finishLevel(): Promise<void> {}

  public update(_delta: number): void {}

  private async enableCropPlacement(cropType: CropType) {
    const highlight: ObjectHighlight = new ObjectHighlight();
    if (cropType == CropType.Corn) {
      highlight.init(ObjectsMeshEnum.Corn1);
    } else if (cropType == CropType.Tomato) {
      highlight.init(ObjectsMeshEnum.Tomato1);
    } else if (cropType == CropType.Grape) {
      highlight.init(ObjectsMeshEnum.Grape1);
    } else {
      highlight.init(ObjectsMeshEnum.Strawberry1);
    }

    const grounds = Game.instance.getGrounds();
    for (let i = 0; i < grounds.length; i++) {
      const areas = grounds[i].getInteractiveAreas();
      for (let j = 0; j < areas.length; j++) {
        const area = areas[j];
        if (area.blocked) continue;
        area.enableInteractiveArea(highlight, async (_sender) => {
          area?.disableInteractiveArea();

          let isCreated = false;
          if (cropType == CropType.Corn) {
            isCreated = await this.placeCorn(area);
          } else if (cropType == CropType.Tomato) {
            isCreated = await this.placeTomato(area);
          } else if (cropType == CropType.Grape) {
            isCreated = await this.placeGrape(area);
          } else {
            isCreated = await this.placeStrawberry(area);
          }
          if (isCreated) {
            area.blocked = true;
            PixiAssetsLoader.instance.playSound(SoundAsset.Click);
            this.checkBlockCropUiButtons();
          }
        });
      }
    }
  }

  private async finishDay() {
    this.disablePlacement();
    await Game.instance.dayNightController.setEvening();
    ConfirmationPopup.instance.showPopup("FINISH THE DAY?", async () => {
      const income = this.collectCattleIncome();
      if (income + MoneyCost[MoneyCostType.RentDaily] > 0) {
        await GameOverPopup.instance.showPopup(
          "Congratulations!\nYou've defeated the Rent",
          false,
          () => {
            // TODO: Congratulations?
          },
        );
      }
      await Game.instance.dayNightController.setNight();
      await Game.instance.dayNightController.setMorning();
      this.growCrops();

      await this.rentCheck();

      await Game.instance.dayNightController.setDay();
    });
  }

  private async rentCheck() {
    Game.instance.toggleChickenGuide(true, false);
    const randomIndex = Math.floor(
      Math.random() * MainLevel.rentMessages.length,
    );
    const message = MainLevel.rentMessages[randomIndex];
    await DialogPopup.instance.showPopup(message);
    const rent = MoneyCost[MoneyCostType.RentDaily];
    Game.instance.toggleChickenGuide(false);
    const money = Game.instance.money + rent;
    if (money < 0) {
      await GameOverPopup.instance.showPopup(
        "You were defeated by the Rent.\nYou can try again, or check the Sources\n",
        true,
        () => {
          Game.instance.resetGame();
          Game.instance.startGame();
        },
      );
    } else {
      Game.instance.money += rent;
      FloatingText.playEffect(rent, new Vector3(0, 0, 0));
    }
  }

  private collectCattleIncome(): number {
    const cattle = Game.instance.getCattle();
    let total = 0;
    cattle.forEach((animal) => {
      let income = 0;
      switch (animal.cattleType) {
        case CattleType.Chicken:
          income = MoneyCost[MoneyCostType.ChickenDaily];
          break;
        case CattleType.Cow:
          income = MoneyCost[MoneyCostType.CowDaily];
          break;
        case CattleType.Sheep:
          income = MoneyCost[MoneyCostType.SheepDaily];
          break;
      }
      total += income;
      Game.instance.money += income;
      const animalPosition = animal.getWorldPosition(new Vector3());
      FloatingText.playEffect(income, animalPosition);
    });
    return total;
  }

  private async growCrops() {
    const crops = Game.instance.getCrops();
    crops.forEach((crop) => {
      crop.advanceStage();
      const readyToHarvest = crop.currentStage >= 3;
      if (readyToHarvest) {
        crop.enableInteraction(async (_sender) => {
          await this.harvestCrop(crop);
        });
      }
    });
  }

  private async harvestCrop(crop: MultiStageObject) {
    let income = 0;
    switch (crop.cropType) {
      case CropType.Corn:
        income = MoneyCost[MoneyCostType.CornHarvest];
        break;
      case CropType.Tomato:
        income = MoneyCost[MoneyCostType.TomatoHarvest];
        break;
      case CropType.Grape:
        income = MoneyCost[MoneyCostType.GrapeHarvest];
        break;
      case CropType.Strawberry:
        income = MoneyCost[MoneyCostType.StrawberryHarvest];
        break;
    }
    const cropPosition = crop.getWorldPosition(new Vector3());
    Game.instance.money += income;
    FloatingText.playEffect(income, cropPosition);
    await crop.playDisappearAnimation();
    Game.instance.destroyMultiStageObject(crop);
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
  }

  private async enableCattlePlacement(cattleType: CattleType) {
    let highlight!: ObjectHighlight;
    if (cattleType == CattleType.Cow) {
      const cowHighlight = new ObjectHighlight();
      await cowHighlight.init(ObjectsMeshEnum.Cow);
      highlight = cowHighlight;
    } else {
      const sheepHighlight = new ObjectHighlight();
      await sheepHighlight.init(ObjectsMeshEnum.Sheep);
      highlight = sheepHighlight;
    }

    const fences = Game.instance.getFences();
    for (let i = 0; i < fences.length; i++) {
      const areas = fences[i].getInteractiveAreas();
      for (let j = 0; j < areas.length; j++) {
        const area = areas[j];
        if (area.blocked) continue;
        area.enableInteractiveArea(highlight, async (_sender) => {
          area?.disableInteractiveArea();

          let isCreated = false;
          if (cattleType == CattleType.Cow) {
            isCreated = await this.placeCow(area);
          } else {
            isCreated = await this.placeSheep(area);
          }
          if (isCreated) {
            area.blocked = true;
            this.checkBlockCattleUiButtons();
          }
        });
      }
    }
  }

  private async enableLandPlacement(landType: LandType) {
    let highlight!: ObjectHighlight;
    if (landType == LandType.Fence) {
      const fenceHighlight = new ObjectHighlight();
      await fenceHighlight.init(ObjectsMeshEnum.Fence);
      highlight = fenceHighlight;
    } else {
      const groundHighlight = new ObjectHighlight();
      await groundHighlight.init(ObjectsMeshEnum.Ground);
      highlight = groundHighlight;
    }

    this.landPlacements.forEach((area) => {
      area.enableInteractiveArea(highlight, async (_sender) => {
        area?.disableInteractiveArea();

        let isCreated = false;
        if (landType == LandType.Fence) {
          isCreated = await this.placeFence(area);
        } else {
          isCreated = await this.placeGround(area);
        }

        if (isCreated) {
          Game.instance.removeInteractiveArea(area);
          const index = this.landPlacements.indexOf(area);
          this.landPlacements.splice(index, 1);

          this.checkBlockLandUiButtons();
        }
      });
    });
  }

  private checkBlockLandUiButtons() {
    if (this.landPlacements.length <= 0) {
      Game.instance.UIScene.landPlacementMenu.setEnabled(
        false,
        LandPlacementMenu.CattlePen | LandPlacementMenu.Cropland,
      );
      Game.instance.UIScene.homeMenu.setEnabled(false, HomeMenu.Land);
    }
  }

  private checkBlockCattleUiButtons() {
    // TODO
  }
  private checkBlockCropUiButtons() {
    // TODO
  }

  private async placeCrop(
    cost: number,
    location: InteractiveArea,
    cropConstructor: () => Promise<MultiStageObject>,
  ): Promise<boolean> {
    const money = Game.instance.money + cost;
    if (money < 0) {
      PixiAssetsLoader.instance.playSound(SoundAsset.ThrowSpear);
      this.disablePlacement();
      Game.instance.money += 0; // to trigger shake animation
      return false;
    }
    Game.instance.money += cost;
    const position = location.getWorldPosition(new Vector3());
    FloatingText.playEffect(cost, position);
    const crop = await cropConstructor();
    crop.setStage1();
    crop.placedAtArea = location;
    this.setNewObjectLocationWorld(crop, location);
    return true;
  }

  private async placeCorn(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.CornPlant];
    return await this.placeCrop(cost, location, async () => {
      return await Game.instance.createCorn();
    });
  }
  private async placeTomato(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.TomatoPlant];
    return await this.placeCrop(cost, location, async () => {
      return await Game.instance.createTomato();
    });
  }
  private async placeGrape(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.GrapePlant];
    return await this.placeCrop(cost, location, async () => {
      return await Game.instance.createGrape();
    });
  }
  private async placeStrawberry(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.StrawberryPlant];
    return await this.placeCrop(cost, location, async () => {
      return await Game.instance.createStrawberry();
    });
  }

  private async placeCattle(
    cost: number,
    location: InteractiveArea,
    cattleConstructor: () => Promise<AnimatedObject>,
  ): Promise<boolean> {
    const money = Game.instance.money + cost;
    if (money < 0) {
      PixiAssetsLoader.instance.playSound(SoundAsset.ThrowSpear);
      this.disablePlacement();
      Game.instance.money += 0; // to trigger shake animation
      return false;
    }
    Game.instance.money += cost;
    const position = location.getWorldPosition(new Vector3());
    FloatingText.playEffect(cost, position);
    const cattle = await cattleConstructor();
    this.setNewObjectLocationWorld(cattle, location);
    return true;
  }
  private async placeCow(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.CowBuy];
    return await this.placeCattle(cost, location, async () => {
      PixiAssetsLoader.instance.playSound(SoundAsset.Cow);
      const cow = await Game.instance.createCow();
      const soundSource = new SoundSource({
        sound: SoundAsset.Cow,
        minInterval: 15,
        maxInterval: 90,
        volume: 0.4,
      });
      cow.add(soundSource);
      cow.soundSource = soundSource;
      soundSource.start();
      return cow;
    });
  }
  private async placeSheep(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.SheepBuy];
    return await this.placeCattle(cost, location, async () => {
      PixiAssetsLoader.instance.playSound(SoundAsset.Sheep);
      const sheep = await Game.instance.createSheep();
      const soundSource = new SoundSource({
        sound: SoundAsset.Sheep,
        minInterval: 15,
        maxInterval: 90,
        volume: 0.4,
      });
      sheep.add(soundSource);
      sheep.soundSource = soundSource;
      soundSource.start();
      return sheep;
    });
  }

  private async placeLand(
    cost: number,
    location: InteractiveArea,
    landConstructor: () => Promise<PlaceableObject>,
  ): Promise<boolean> {
    const money = Game.instance.money + cost;
    if (money < 0) {
      PixiAssetsLoader.instance.playSound(SoundAsset.ThrowSpear);
      this.disablePlacement();
      Game.instance.money += 0; // to trigger shake animation
      return false;
    }
    Game.instance.money += cost;
    FloatingText.playEffect(
      cost,
      new Vector3(location.position.x, 3, location.position.z),
    );
    const land = await landConstructor();
    this.setNewObjectLocation(land, location);
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    return true;
  }
  private async placeFence(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.FenceMake];
    return await this.placeLand(cost, location, async () => {
      return await Game.instance.createFence();
    });
  }
  private async placeGround(location: InteractiveArea): Promise<boolean> {
    const cost = MoneyCost[MoneyCostType.GroundMake];
    return await this.placeLand(cost, location, async () => {
      return await Game.instance.createGround();
    });
  }
  private setNewObjectLocation(object: Object3D, location: Object3D) {
    object.rotation.set(0, location.rotation.y, 0);
    object.position.set(
      location.position.x,
      location.position.y,
      location.position.z,
    );
  }
  private setNewObjectLocationWorld(object: Object3D, location: Object3D) {
    const worldPosion = location.getWorldPosition(new Vector3());
    const worldRotation = location.getWorldQuaternion(new Quaternion());
    object.rotation.setFromQuaternion(worldRotation);
    object.position.set(worldPosion.x, worldPosion.y, worldPosion.z);
  }

  private async createLandPlacementPoints() {
    const placement1 = await Game.instance.createInteractiveArea(6, 2, 10);
    placement1.position.set(-10, 0, 4.5);
    placement1.rotation.set(0, Math.PI / 2, 0);
    this.landPlacements.push(placement1);

    const placement2 = await Game.instance.createInteractiveArea(6, 2, 10);
    placement2.position.set(9, 0, 8);
    placement2.rotation.set(0, -Math.PI / 2, 0);
    this.landPlacements.push(placement2);
  }

  private disablePlacement() {
    const fences = Game.instance.getFences();
    fences.forEach((fence) => {
      fence.disableInteraction();
    });

    const grounds = Game.instance.getGrounds();
    grounds.forEach((ground) => {
      ground.disableInteraction();
    });
    this.landPlacements.forEach((area) => {
      area.disableInteractiveArea();
    });
  }

  private bindUI() {
    Game.instance.UIScene.cattlePlacementMenu.onCowClick = () => {
      this.disablePlacement();
      this.enableCattlePlacement(CattleType.Cow);
    };
    Game.instance.UIScene.cattlePlacementMenu.onSheepClick = () => {
      this.disablePlacement();
      this.enableCattlePlacement(CattleType.Sheep);
    };
    Game.instance.UIScene.cattlePlacementMenu.onBackClick = () => {
      this.disablePlacement();
      Game.instance.UIScene.showHomeMenu();
    };

    Game.instance.UIScene.cropPlacementMenu.onCornClick = () => {
      this.enableCropPlacement(CropType.Corn);
    };
    Game.instance.UIScene.cropPlacementMenu.onGrapeClick = () => {
      this.enableCropPlacement(CropType.Grape);
    };
    Game.instance.UIScene.cropPlacementMenu.onStrawberryClick = () => {
      this.enableCropPlacement(CropType.Strawberry);
    };
    Game.instance.UIScene.cropPlacementMenu.onTomatoClick = () => {
      this.enableCropPlacement(CropType.Tomato);
    };
    Game.instance.UIScene.cropPlacementMenu.onBackClick = () => {
      this.disablePlacement();
      Game.instance.UIScene.showHomeMenu();
    };

    Game.instance.UIScene.landPlacementMenu.onCattlePenClick = () => {
      this.enableLandPlacement(LandType.Fence);
    };
    Game.instance.UIScene.landPlacementMenu.onCroplandClick = () => {
      this.enableLandPlacement(LandType.Ground);
    };
    Game.instance.UIScene.landPlacementMenu.onBackClick = () => {
      this.disablePlacement();
      Game.instance.UIScene.showHomeMenu();
    };

    Game.instance.UIScene.gameControls.onSkipDayClick = () => {
      this.finishDay();
    };
  }
}
