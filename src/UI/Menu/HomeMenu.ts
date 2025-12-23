import SpriteButton from "../SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";
import MenuBase from "./MenuBase";

export default class HomeMenu extends MenuBase {
  private cropButton!: SpriteButton;
  private cattleButton!: SpriteButton;
  private landButton!: SpriteButton;

  public onCropClick?: () => void;
  public onCattleClick?: () => void;
  public onLandClick?: () => void;

  constructor() {
    super();
    this.label = "HomeMenu";
    this.interactive = true;
  }

  public init(): void {
    const assets = PixiAssetsLoader.instance;
    const spacing = 80;

    this.cropButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Corn),
      text: "Crop",
      onClick: () => this.onCropClick?.(),
    });
    this.cropButton.position.set(0, 0);
    this.addChild(this.cropButton);

    this.cattleButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Cow),
      text: "Cattle",
      onClick: () => this.onCattleClick?.(),
    });
    this.cattleButton.position.set(0, spacing);
    this.addChild(this.cattleButton);

    this.landButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Plus),
      text: "Land",
      onClick: () => this.onLandClick?.(),
    });
    this.landButton.position.set(0, spacing * 2);
    this.addChild(this.landButton);
  }

  public static readonly Crop = 1 << 0;
  public static readonly Cattle = 1 << 1;
  public static readonly Land = 1 << 2;
  public static readonly All = HomeMenu.Crop | HomeMenu.Cattle | HomeMenu.Land;

  public setEnabled(enabled: boolean, mask: number = HomeMenu.All): void {
    if (mask & HomeMenu.Crop) this.cropButton.setEnabled(enabled);
    if (mask & HomeMenu.Cattle) this.cattleButton.setEnabled(enabled);
    if (mask & HomeMenu.Land) this.landButton.setEnabled(enabled);
  }
}
