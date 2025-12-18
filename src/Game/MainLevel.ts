import { Object3D, Quaternion, Vector3 } from "three";
import { InteractiveArea } from "../Objects/InteractiveArea";
import ObjectHighlight from "../Objects/ObjectHighlight";
import { ObjectsMeshEnum } from "../Objects/ObjectsMeshEnum";
import PlaceableObject from "../Objects/PlaceableObject";
import Game from "./Game";
import GameLevel from "./GameLevel";
import LandPlacementMenu from "../UI/LandPlacementMenu";
import HomeMenu from "../UI/HomeMenu";
import ConfirmationPopup from "../UI/ConfirmationPopup";
import DialogPopup from "../UI/DialogPopup";
import MultiStageObject from "../Objects/MultiStageObject";

export enum CropType {
  Corn,
  Grape,
  Strawberry,
  Tomato,
}

export enum CattleType {
  Cow,
  Sheep,
}

export enum LandType {
  Fence,
  Ground,
}

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

  public update(delta: number): void {}

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
    ConfirmationPopup.instance.showPopup("FINISH THE DAY?", () => {
      this.growCrops();
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
        })
      }
    });
  }

  private async harvestCrop(crop: MultiStageObject) {
    crop.playEffect();
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
    const corn = await Game.instance.createCorn();
    corn.setStage1();
    corn.placedAtArea = location;
    this.setNewObjectLocationWorld(corn, location);
  }
  private async placeTomato(location: InteractiveArea) {
    const tomato = await Game.instance.createTomato();
    tomato.setStage1();
    tomato.placedAtArea = location;
    this.setNewObjectLocationWorld(tomato, location);
  }
  private async placeGrape(location: InteractiveArea) {
    const grape = await Game.instance.createGrape();
    grape.setStage1();
    grape.placedAtArea = location;
    this.setNewObjectLocationWorld(grape, location);
  }
  private async placeStrawberry(location: InteractiveArea) {
    const strawberry = await Game.instance.createStrawberry();
    strawberry.setStage1();
    strawberry.placedAtArea = location;
    this.setNewObjectLocationWorld(strawberry, location);
  }

  private async placeCow(location: InteractiveArea) {
    const cow = await Game.instance.createCow();
    this.setNewObjectLocationWorld(cow, location);
  }
  private async placeSheep(location: InteractiveArea) {
    const sheep = await Game.instance.createSheep();
    this.setNewObjectLocationWorld(sheep, location);
  }
  private async placeFence(location: InteractiveArea) {
    const fence = await Game.instance.createFence();
    this.setNewObjectLocation(fence, location);
  }
  private async placeGround(location: InteractiveArea) {
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

  private bindUI() {
    Game.instance.UIScene.cattlePlacementMenu.onCowClick = () => {
      this.enableCattlePlacement(CattleType.Cow);
    };
    Game.instance.UIScene.cattlePlacementMenu.onSheepClick = () => {
      this.enableCattlePlacement(CattleType.Sheep);
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

    Game.instance.UIScene.landPlacementMenu.onCattlePenClick = () => {
      this.enableLandPlacement(LandType.Fence);
    };
    Game.instance.UIScene.landPlacementMenu.onCroplandClick = () => {
      this.enableLandPlacement(LandType.Ground);
    };
    Game.instance.UIScene.gameControls.onSkipDayClick = () => {
      this.finishDay();
    };
  }
}
