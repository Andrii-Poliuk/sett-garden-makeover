import { Container } from "pixi.js";
import DialogPopup from "./Popups/DialogPopup";
import ConfirmationPopup from "./Popups/ConfirmationPopup";
import GameOverPopup from "./Popups/GameOverPopup";
import LoadingPopup from "./Popups/LoadingPopup";
import CropPlacementMenu from "./Menu/CropPlacementMenu";
import CattlePlacementMenu from "./Menu/CattlePlacementMenu";
import HomeMenu from "./Menu/HomeMenu";
import LandPlacementMenu from "./Menu/LandPlacementMenu";
import GameControls from "./Menu/GameControls";
import FloatingText from "../Particles/FloatingText";

export default class UIScene {
  public stage: Container;

  private homeMenuInstance!: HomeMenu;
  private cropPlacementMenuInstance!: CropPlacementMenu;
  private cattlePlacementMenuInstance!: CattlePlacementMenu;
  private landPlacementMenuInstance!: LandPlacementMenu;
  private gameControlsInstance!: GameControls;
  private dialogPopup!: DialogPopup;
  private confirmationPopup!: ConfirmationPopup;
  private gameOverPopup!: GameOverPopup;
  private loadingPopup!: LoadingPopup;
  private floatingTextContainer!: Container;

  private minimumWidth: number = 700;
  private minimumHeight: number = 600;

  private currentWidth: number = 800;
  private currentHeight: number = 600;
  private currentScale: number = 1;

  public get homeMenu(): HomeMenu {
    return this.homeMenuInstance;
  }

  public get cropPlacementMenu(): CropPlacementMenu {
    return this.cropPlacementMenuInstance;
  }

  public get cattlePlacementMenu(): CattlePlacementMenu {
    return this.cattlePlacementMenuInstance;
  }

  public get landPlacementMenu(): LandPlacementMenu {
    return this.landPlacementMenuInstance;
  }

  public get gameControls(): GameControls {
    return this.gameControlsInstance;
  }

  public showHomeMenu() {
    this.homeMenuInstance.resize(this.currentScale);
    this.homeMenuInstance.show();
    this.cropPlacementMenuInstance.hide();
    this.cattlePlacementMenuInstance.hide();
    this.landPlacementMenuInstance.hide();
  }

  public showCropMenu() {
    this.cropPlacementMenuInstance.resize(this.currentScale);
    this.homeMenuInstance.hide();
    this.cropPlacementMenuInstance.show();
    this.cattlePlacementMenuInstance.hide();
    this.landPlacementMenuInstance.hide();
  }

  public showCattleMenu() {
    this.cattlePlacementMenuInstance.resize(this.currentScale);
    this.homeMenuInstance.hide();
    this.cropPlacementMenuInstance.hide();
    this.cattlePlacementMenuInstance.show();
    this.landPlacementMenuInstance.hide();
  }

  public showLandMenu() {
    this.landPlacementMenuInstance.resize(this.currentScale);
    this.homeMenuInstance.hide();
    this.cropPlacementMenuInstance.hide();
    this.cattlePlacementMenuInstance.hide();
    this.landPlacementMenuInstance.show();
  }

  public hideMenu() {
    this.homeMenuInstance.hide();
    this.cropPlacementMenuInstance.hide();
    this.cattlePlacementMenuInstance.hide();
    this.landPlacementMenuInstance.hide();
  }

  public showGameControls(mask: number = GameControls.All): void {
    this.gameControlsInstance.resize(
      this.currentWidth,
      this.currentHeight,
      this.currentScale,
    );
    this.gameControlsInstance.show(mask);
  }

  public hideGameControls(mask: number = GameControls.All): void {
    this.gameControlsInstance.hide(mask);
  }

  constructor() {
    this.stage = new Container();
  }

  public async init(): Promise<void> {
    this.homeMenuInstance = new HomeMenu();
    this.homeMenuInstance.position.set(60, 120);
    this.homeMenuInstance.setOriginalPosition(60, 120);
    this.homeMenuInstance.init();
    this.stage.addChild(this.homeMenuInstance);
    this.homeMenu.onCropClick = () => {
      this.showCropMenu();
    };
    this.homeMenu.onCattleClick = () => {
      this.showCattleMenu();
    };
    this.homeMenu.onLandClick = () => {
      this.showLandMenu();
    };

    this.cattlePlacementMenuInstance = new CattlePlacementMenu();
    this.cattlePlacementMenuInstance.position.set(60, 120);
    this.cattlePlacementMenuInstance.setOriginalPosition(60, 120);
    this.cattlePlacementMenuInstance.init();
    this.stage.addChild(this.cattlePlacementMenuInstance);
    this.cattlePlacementMenuInstance.visible = false;
    this.cattlePlacementMenu.onBackClick = () => {
      this.showHomeMenu();
    };

    this.cropPlacementMenuInstance = new CropPlacementMenu();
    this.cropPlacementMenuInstance.position.set(60, 120);
    this.cropPlacementMenuInstance.setOriginalPosition(60, 120);
    this.cropPlacementMenuInstance.init();
    this.stage.addChild(this.cropPlacementMenuInstance);
    this.cropPlacementMenuInstance.visible = false;
    this.cropPlacementMenuInstance.onBackClick = () => {
      this.showHomeMenu();
    };

    this.landPlacementMenuInstance = new LandPlacementMenu();
    this.landPlacementMenuInstance.position.set(60, 120);
    this.landPlacementMenuInstance.setOriginalPosition(60, 120);
    this.landPlacementMenuInstance.init();
    this.stage.addChild(this.landPlacementMenuInstance);
    this.landPlacementMenuInstance.visible = false;
    this.landPlacementMenuInstance.onBackClick = () => {
      this.showHomeMenu();
    };

    this.gameControlsInstance = new GameControls();
    this.gameControlsInstance.init();
    this.stage.addChild(this.gameControlsInstance);

    this.dialogPopup = DialogPopup.instance;
    this.dialogPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.dialogPopup);

    this.confirmationPopup = ConfirmationPopup.instance;
    this.confirmationPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.confirmationPopup);

    this.gameOverPopup = GameOverPopup.instance;
    this.gameOverPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.gameOverPopup);

    this.loadingPopup = LoadingPopup.instance;
    this.loadingPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.loadingPopup);

    this.floatingTextContainer = new Container();
    this.stage.addChild(this.floatingTextContainer);
    FloatingText.init(this.floatingTextContainer);

    this.hideMenu();
    this.gameControls.hide();
  }

  public resize(width: number, height: number): void {
    const scaleX = width > this.minimumWidth ? 1 : width / this.minimumHeight;
    const scaleY = height > this.minimumHeight ? 1 : height / this.minimumWidth;
    const flexibleScale = Math.min(scaleX, scaleY);

    this.currentWidth = width;
    this.currentHeight = height;
    this.currentScale = flexibleScale;

    this.dialogPopup.resize(width, height, flexibleScale);
    this.confirmationPopup.resize(width, height, flexibleScale);
    this.gameOverPopup.resize(width, height, flexibleScale);
    this.loadingPopup.resize(width, height, flexibleScale);

    this.gameControlsInstance.resize(width, height, flexibleScale);

    this.homeMenuInstance.resize(flexibleScale);
    this.cropPlacementMenuInstance.resize(flexibleScale);
    this.cattlePlacementMenuInstance.resize(flexibleScale);
    this.landPlacementMenuInstance.resize(flexibleScale);
  }
}
