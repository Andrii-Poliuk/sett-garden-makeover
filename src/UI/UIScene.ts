import { Container } from "pixi.js";
import PixiAssetsLoader from "./PixiAssetsLoader";
import DialogPopup from "./DialogPopup";
import ConfirmationPopup from "./ConfirmationPopup";
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
  private floatingTextContainer!: Container;

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
    this._homeMenu.visible = true;
    this._cropPlacementMenu.visible = false;
    this._cattlePlacementMenu.visible = false;
    this._landPlacementMenu.visible = false;
  }

  public showCropMenu() {
    this._homeMenu.visible = false;
    this._cropPlacementMenu.visible = true;
    this._cattlePlacementMenu.visible = false;
    this._landPlacementMenu.visible = false;
  }

  public showCattleMenu() {
    this._homeMenu.visible = false;
    this._cropPlacementMenu.visible = false;
    this._cattlePlacementMenu.visible = true;
    this._landPlacementMenu.visible = false;
  }

  public showLandMenu() {
    this._homeMenu.visible = false;
    this._cropPlacementMenu.visible = false;
    this._cattlePlacementMenu.visible = false;
    this._landPlacementMenu.visible = true;
  }

  public hideMenu() {
    this._homeMenu.visible = false;
    this._cropPlacementMenu.visible = false;
    this._cattlePlacementMenu.visible = false;
    this._landPlacementMenu.visible = false;
  }

  public showGameControls(mask: number = GameControls.ALL): void {
    this._gameControls.show(mask);
  }

  public hideGameControls(mask: number = GameControls.ALL): void {
    this._gameControls.hide(mask);
  }

  constructor() {
    this.stage = new Container();
  }

  public async init(): Promise<void> {
    await PixiAssetsLoader.instance.loadAssets();

    this._homeMenu = new HomeMenu();
    this._homeMenu.position.set(60, 120);
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
    this._cattlePlacementMenu.init();
    this.stage.addChild(this._cattlePlacementMenu);
    this._cattlePlacementMenu.visible = false;
    this.cattlePlacementMenu.onBackClick = () => {
      this.showHomeMenu();
    }

    this._cropPlacementMenu = new CropPlacementMenu();
    this._cropPlacementMenu.position.set(60, 120);
    this._cropPlacementMenu.init();
    this.stage.addChild(this._cropPlacementMenu);
    this._cropPlacementMenu.visible = false;
    this._cropPlacementMenu.onBackClick = () => {
      this.showHomeMenu();
    };

    this._landPlacementMenu = new LandPlacementMenu();
    this._landPlacementMenu.position.set(60, 120);
    this._landPlacementMenu.init();
    this.stage.addChild(this._landPlacementMenu);
    this._landPlacementMenu.visible = false;
    this._landPlacementMenu.onBackClick = () => {
      this.showHomeMenu();
    };

    this._gameControls = new GameControls();
    this._gameControls.init();
    this._gameControls.position.set(window.innerWidth - 180, 40);
    this.stage.addChild(this._gameControls);

    this.dialogPopup = DialogPopup.instance;
    this.dialogPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.dialogPopup);

    this.confirmationPopup = ConfirmationPopup.instance;
    this.confirmationPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.confirmationPopup);

    this.floatingTextContainer = new Container();
    this.stage.addChild(this.floatingTextContainer);
    FloatingText.init(this.floatingTextContainer);

    this.hideMenu();
    this.gameControls.hide();
  }

  public resize(width: number, height: number): void {
    this.dialogPopup.resize(width, height);
    this.confirmationPopup.resize(width, height);
    this._gameControls.position.set(width - 180, 40);
  }

  public update(delta: number): void {}
}
