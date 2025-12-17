import { Container } from "pixi.js";
import SpriteButton from "./SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "./PixiAssetsLoader";

export default class LandPlacementMenu extends Container {
  private croplandButton!: SpriteButton;
  private cattlePenButton!: SpriteButton;
  private backButton!: SpriteButton;

  public onCroplandClick?: () => void;
  public onCattlePenClick?: () => void;
  public onBackClick?: () => void;

  constructor() {
    super();
    this.label = "LandPlacementMenu";
    this.interactive = true;
  }

  public init(): void {
    const assets = PixiAssetsLoader.instance;
    const spacing = 80;

    this.croplandButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Corn),
      text: "Cropland",
      onClick: () => this.onCroplandClick?.(),
    });
    this.croplandButton.position.set(0, 0);
    this.addChild(this.croplandButton);

    this.cattlePenButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Cow),
      text: "Cattle Pen",
      onClick: () => this.onCattlePenClick?.(),
    });
    this.cattlePenButton.position.set(0, spacing);
    this.addChild(this.cattlePenButton);

    this.backButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.SkipDay),
      text: "Back",
      onClick: () => this.onBackClick?.(),
    });
    this.backButton.position.set(0, spacing * 2);
    this.addChild(this.backButton);
    const backButtonScale = this.backButton.sprite.scale;
    this.backButton.sprite.scale.set(-backButtonScale.x,backButtonScale.y);
  }

  public static readonly CROPLAND = 1 << 0;
  public static readonly CATTLE_PEN = 1 << 1;
  public static readonly BACK = 1 << 2;
  public static readonly ALL = LandPlacementMenu.CROPLAND | LandPlacementMenu.CATTLE_PEN | LandPlacementMenu.BACK;

  public setEnabled(enabled: boolean, mask: number = LandPlacementMenu.ALL): void {
    if (mask & LandPlacementMenu.CROPLAND) this.croplandButton.setEnabled(enabled);
    if (mask & LandPlacementMenu.CATTLE_PEN) this.cattlePenButton.setEnabled(enabled);
    if (mask & LandPlacementMenu.BACK) this.backButton.setEnabled(enabled);
  }
}
