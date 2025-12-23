import SpriteButton from "../SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";
import MenuBase from "./MenuBase";

export default class CropPlacementMenu extends MenuBase {
  private cornButton!: SpriteButton;
  private tomatoButton!: SpriteButton;
  private grapeButton!: SpriteButton;
  private strawberryButton!: SpriteButton;
  private backButton!: SpriteButton;

  public onCornClick?: () => void;
  public onTomatoClick?: () => void;
  public onGrapeClick?: () => void;
  public onStrawberryClick?: () => void;
  public onBackClick?: () => void;

  constructor() {
    super();
    this.label = "CropPlacementMenu";
    this.interactive = true;
  }

  public init(): void {
    const assets = PixiAssetsLoader.instance;
    const spacing = 80;

    this.cornButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Corn),
      text: "Corn",
      onClick: () => this.onCornClick?.(),
    });
    this.cornButton.position.set(0, 0);
    this.addChild(this.cornButton);

    this.tomatoButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Tomato),
      text: "Tomato",
      onClick: () => this.onTomatoClick?.(),
    });
    this.tomatoButton.position.set(0, spacing);
    this.addChild(this.tomatoButton);

    this.grapeButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Grape),
      text: "Grape",
      onClick: () => this.onGrapeClick?.(),
    });
    this.grapeButton.position.set(0, spacing * 2);
    this.addChild(this.grapeButton);

    this.strawberryButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Strawberry),
      text: "Strawberry",
      onClick: () => this.onStrawberryClick?.(),
    });
    this.strawberryButton.position.set(0, spacing * 3);
    this.addChild(this.strawberryButton);

    this.backButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.SkipDay),
      text: "Back",
      onClick: () => this.onBackClick?.(),
    });
    this.backButton.position.set(0, spacing * 4);
    this.addChild(this.backButton);
    const backButtonScale = this.backButton.sprite.scale;
    this.backButton.sprite.scale.set(-backButtonScale.x, backButtonScale.y);
  }

  public static readonly Corn = 1 << 0;
  public static readonly Tomato = 1 << 1;
  public static readonly Grape = 1 << 2;
  public static readonly Strawberry = 1 << 3;
  public static readonly Back = 1 << 4;
  public static readonly All =
    CropPlacementMenu.Corn |
    CropPlacementMenu.Tomato |
    CropPlacementMenu.Grape |
    CropPlacementMenu.Strawberry |
    CropPlacementMenu.Back;

  public setEnabled(
    enabled: boolean,
    mask: number = CropPlacementMenu.All,
  ): void {
    if (mask & CropPlacementMenu.Corn) this.cornButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Tomato) this.tomatoButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Grape) this.grapeButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Strawberry)
      this.strawberryButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Back) this.backButton.setEnabled(enabled);
  }
}
