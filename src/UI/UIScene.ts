import { Container } from "pixi.js";
import PixiAssetsLoader from "./PixiAssetsLoader";
import DialogPopup from "./DialogPopup";
import ConfirmationPopup from "./ConfirmationPopup";
import CropPlacementMenu from "./CropPlacementMenu";
import CattlePlacementMenu from "./CattlePlacementMenu";
import HomeMenu from "./HomeMenu";
import LandPlacementMenu from "./LandPlacementMenu";

export default class UIScene {
  stage: Container;

  private _homeMenu!: HomeMenu;
  private _cropPlacementMenu!: CropPlacementMenu;
  private _cattlePlacementMenu!: CattlePlacementMenu;
  private _landPlacementMenu!: LandPlacementMenu;
  private dialogPopup!: DialogPopup;
  private confirmationPopup!: ConfirmationPopup;

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

  constructor() {
    this.stage = new Container();
  }

  public async init(): Promise<void> {
    await PixiAssetsLoader.instance.loadAssets();

    this._homeMenu = new HomeMenu();
    this._homeMenu.position.set(60, 120);
    this._homeMenu.init();
    this.stage.addChild(this._homeMenu);
    this._homeMenu.visible = false;
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

    this.dialogPopup = DialogPopup.instance;
    this.dialogPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.dialogPopup);

    this.confirmationPopup = ConfirmationPopup.instance;
    this.confirmationPopup.init(window.innerWidth, window.innerHeight);
    this.stage.addChild(this.confirmationPopup);
  }

  public resize(width: number, height: number): void {
    this.dialogPopup.resize(width, height);
    this.confirmationPopup.resize(width, height);
  }

  public update(delta: number): void {}
}
