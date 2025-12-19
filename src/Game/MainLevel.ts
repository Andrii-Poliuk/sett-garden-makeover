import { Object3D, Quaternion, Vector3 } from "three";
import { InteractiveArea } from "../Objects/InteractiveArea";
import ObjectHighlight from "../Objects/ObjectHighlight";
import { ObjectsMeshEnum } from "../Objects/ObjectsMeshEnum";
import PlaceableObject from "../Objects/PlaceableObject";
import Game, { CropType, CattleType, LandType } from "./Game";
import GameLevel from "./GameLevel";
import LandPlacementMenu from "../UI/LandPlacementMenu";
import HomeMenu from "../UI/HomeMenu";
import ConfirmationPopup from "../UI/ConfirmationPopup";
import DialogPopup from "../UI/DialogPopup";
import MultiStageObject from "../Objects/MultiStageObject";
import MoneyCost, { MoneyCostType } from "./MoneyCost";
import FloatingText from "../Particles/FloatingText";

export default class MainLevel extends GameLevel {
  private landPlacements: InteractiveArea[] = [];

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
  }

  public async finishLevel(): Promise<void> {}

  public update(delta: number): void {
    this.landPlacements
  }

  private async enableCropPlacement(cropType: CropType) {
    let highlight: ObjectHighlight = new ObjectHighlight();
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
        area.enableInteractiveArea(highlight, async (sender) => {
          area?.disableInteractiveArea();

          if (cropType == CropType.Corn) {
            await this.placeCorn(area);
          } else if (cropType == CropType.Tomato) {
            await this.placeTomato(area);
          } else if (cropType == CropType.Grape) {
            await this.placeGrape(area);
          } else {
            await this.placeStrawberry(area);
          }
          area.blocked = true;

          this.checkBlockCropUiButtons();
        });
      }
    }
  }

  private async finishDay() {
    this.disablePlacement();
    ConfirmationPopup.instance.showPopup("FINISH THE DAY?", () => {
      this.collectCattleIncome();
      this.growCrops();

      const rent = MoneyCost[MoneyCostType.RentDaily];
      Game.instance.money += rent;
      FloatingText.playEffect(rent, new Vector3(0, 0, 0));
    });
  }

  private collectCattleIncome() {
    const cattle = Game.instance.getCattle();
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
      Game.instance.money += income;
      const animalPosition = animal.getWorldPosition(new Vector3());
      FloatingText.playEffect(income, animalPosition);
    });
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
    await crop.playEffect();
    Game.instance.destroyMultiStageObject(crop);
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
        area.enableInteractiveArea(highlight, async (sender) => {
          area?.disableInteractiveArea();

          if (cattleType == CattleType.Cow) {
            await this.placeCow(area);
          } else {
            await this.placeSheep(area);
          }
          area.blocked = true;

          this.checkBlockCattleUiButtons();
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
      area.enableInteractiveArea(highlight, async (sender) => {
        area?.disableInteractiveArea();

        if (landType == LandType.Fence) {
          await this.placeFence(area);
        } else {
          await this.placeGround(area);
        }

        Game.instance.removeInteractiveArea(area);
        const index = this.landPlacements.indexOf(area);
        this.landPlacements.splice(index, 1);

        this.checkBlockLandUiButtons();
      });
    });
  }

  private checkBlockLandUiButtons() {
    if (this.landPlacements.length <= 0) {
      Game.instance.UIScene.landPlacementMenu.setEnabled(
        false,
        LandPlacementMenu.CATTLE_PEN | LandPlacementMenu.CROPLAND
      );
      Game.instance.UIScene.homeMenu.setEnabled(false, HomeMenu.LAND);
    }
  }

  private checkBlockCattleUiButtons() {
    // TODO
  }
  private checkBlockCropUiButtons() {
    // TODO
  }

  private async placeCorn(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.CornPlant];
    const position = location.getWorldPosition(new Vector3());
    Game.instance.money += cost;
    FloatingText.playEffect(cost, position);
    const corn = await Game.instance.createCorn();
    corn.setStage1();
    corn.placedAtArea = location;
    this.setNewObjectLocationWorld(corn, location);
  }
  private async placeTomato(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.TomatoPlant];
    const position = location.getWorldPosition(new Vector3());
    Game.instance.money += cost;
    FloatingText.playEffect(cost, position);
    const tomato = await Game.instance.createTomato();
    tomato.setStage1();
    tomato.placedAtArea = location;
    this.setNewObjectLocationWorld(tomato, location);
  }
  private async placeGrape(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.GrapePlant];
    const position = location.getWorldPosition(new Vector3());
    Game.instance.money += cost;
    FloatingText.playEffect(cost, position);
    const grape = await Game.instance.createGrape();
    grape.setStage1();
    grape.placedAtArea = location;
    this.setNewObjectLocationWorld(grape, location);
  }
  private async placeStrawberry(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.StrawberryPlant];
    const position = location.getWorldPosition(new Vector3());
    Game.instance.money += cost;
    FloatingText.playEffect(cost, position);
    const strawberry = await Game.instance.createStrawberry();
    strawberry.setStage1();
    strawberry.placedAtArea = location;
    this.setNewObjectLocationWorld(strawberry, location);
  }

  private async placeCow(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.CowBuy];
    const position = location.getWorldPosition(new Vector3());
    Game.instance.money += cost;
    FloatingText.playEffect(cost, position);
    const cow = await Game.instance.createCow();
    this.setNewObjectLocationWorld(cow, location);
  }
  private async placeSheep(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.SheepBuy];
    const position = location.getWorldPosition(new Vector3());
    Game.instance.money += cost;
    FloatingText.playEffect(cost, position);
    const sheep = await Game.instance.createSheep();
    this.setNewObjectLocationWorld(sheep, location);
  }
  private async placeFence(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.FenceMake];
    Game.instance.money += cost;
    FloatingText.playEffect(
      cost,
      new Vector3(location.position.x, 3, location.position.z)
    );
    const fence = await Game.instance.createFence();
    this.setNewObjectLocation(fence, location);
  }
  private async placeGround(location: InteractiveArea) {
    const cost = MoneyCost[MoneyCostType.GroundMake];
    Game.instance.money += cost;
    FloatingText.playEffect(
      cost,
      new Vector3(location.position.x, 3, location.position.z)
    );
    const ground = await Game.instance.createGround();
    this.setNewObjectLocation(ground, location);
  }
  private setNewObjectLocation(object: Object3D, location: Object3D) {
    object.rotation.set(0, location.rotation.y, 0);
    object.position.set(
      location.position.x,
      location.position.y,
      location.position.z
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
