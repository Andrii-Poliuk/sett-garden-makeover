import { Container } from "pixi.js";
import DialogPopup from "./DialogPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import GameOverPopup from "./GameOverPopup";
import LoadingPopup from "./LoadingPopup";
import CropPlacementMenu from "./CropPlacementMenu";
import CattlePlacementMenu from "./CattlePlacementMenu";
import HomeMenu from "./HomeMenu";
import LandPlacementMenu from "./LandPlacementMenu";
import GameControls from "./GameControls";
import FloatingText from "../Particles/FloatingText";

export default class UIScene {
  stage: Container;

  private _homeMenu!: HomeMenu;
  private _cropPlacementMenu!: CropPlacementMenu;
  private _cattlePlacementMenu!: CattlePlacementMenu;
  private _landPlacementMenu!: LandPlacementMenu;
  private _gameControls!: GameControls;
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
    return this._homeMenu;
  }

  public get cropPlacementMenu(): CropPlacementMenu {
    return this._cropPlacementMenu;
  }

  public get cattlePlacementMenu(): CattlePlacementMenu {
    return this._cattlePlacementMenu;
  }

  public get landPlacementMenu(): LandPlacementMenu {
    return this._landPlacementMenu;
  }

  public get gameControls(): GameControls {
    return this._gameControls;
  }

  public showHomeMenu() {
    this._homeMenu.show();
    this._cropPlacementMenu.hide();
    this._cattlePlacementMenu.hide();
    this._landPlacementMenu.hide();
    this._homeMenu.resize(this.currentScale);
  }

  public showCropMenu() {
    this._homeMenu.hide();
    this._cropPlacementMenu.show();
    this._cattlePlacementMenu.hide();
    this._landPlacementMenu.hide();
    this._cropPlacementMenu.resize(this.currentScale);
  }

  public showCattleMenu() {
    this._homeMenu.hide();
    this._cropPlacementMenu.hide();
    this._cattlePlacementMenu.show();
    this._landPlacementMenu.hide();
    this._cattlePlacementMenu.resize(this.currentScale);
  }

  public showLandMenu() {
    this._homeMenu.hide();
    this._cropPlacementMenu.hide();
    this._cattlePlacementMenu.hide();
    this._landPlacementMenu.show();
    this._landPlacementMenu.resize(this.currentScale);
  }

  public hideMenu() {
    this._homeMenu.hide();
    this._cropPlacementMenu.hide();
    this._cattlePlacementMenu.hide();
    this._landPlacementMenu.hide();
  }

  public showGameControls(mask: number = GameControls.ALL): void {
    this._gameControls.show(mask);
    this._gameControls.resize(this.currentWidth, this.currentHeight, this.currentScale);
  }

  public hideGameControls(mask: number = GameControls.ALL): void {
    this._gameControls.hide(mask);
  }

  constructor() {
    this.stage = new Container();
  }

  public async init(): Promise<void> {
    this._homeMenu = new HomeMenu();
    this._homeMenu.position.set(60, 120);
    this._homeMenu.setOriginalPosition(60, 120);
    this._homeMenu.init();
    this.stage.addChild(this._homeMenu);
    this.homeMenu.onCropClick = () => {
      this.showCropMenu();
    };
    this.homeMenu.onCattleClick = () => {
      this.showCattleMenu();
    };
    this.homeMenu.onLandClick = () => {
      this.showLandMenu();
    };

    this._cattlePlacementMenu = new CattlePlacementMenu();
    this._cattlePlacementMenu.position.set(60, 120);
    this._cattlePlacementMenu.setOriginalPosition(60, 120);
    this._cattlePlacementMenu.init();
    this.stage.addChild(this._cattlePlacementMenu);
    this._cattlePlacementMenu.visible = false;
    this.cattlePlacementMenu.onBackClick = () => {
      this.showHomeMenu();
    };

    this._cropPlacementMenu = new CropPlacementMenu();
    this._cropPlacementMenu.position.set(60, 120);
    this._cropPlacementMenu.setOriginalPosition(60, 120);
    this._cropPlacementMenu.init();
    this.stage.addChild(this._cropPlacementMenu);
    this._cropPlacementMenu.visible = false;
    this._cropPlacementMenu.onBackClick = () => {
      this.showHomeMenu();
    };

    this._landPlacementMenu = new LandPlacementMenu();
    this._landPlacementMenu.position.set(60, 120);
    this._landPlacementMenu.setOriginalPosition(60, 120);
    this._landPlacementMenu.init();
    this.stage.addChild(this._landPlacementMenu);
    this._landPlacementMenu.visible = false;
    this._landPlacementMenu.onBackClick = () => {
      this.showHomeMenu();
    };

    this._gameControls = new GameControls();
    this._gameControls.init();
    this.stage.addChild(this._gameControls);

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

    this._gameControls.resize(width, height, flexibleScale);

    this._homeMenu.resize(flexibleScale);
    this._cropPlacementMenu.resize(flexibleScale);
    this._cattlePlacementMenu.resize(flexibleScale);
    this._landPlacementMenu.resize(flexibleScale);
  }
}
