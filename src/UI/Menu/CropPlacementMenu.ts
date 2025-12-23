import SpriteButton from "../SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";
import MenuBase from "./MenuBase";
import EconomyHint from "../EconomyHint";
import MoneyCost, { MoneyCostType } from "../../Game/MoneyCost";

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
    EconomyHint.addEconomyHintToButton(this.cornButton, {
      cost: MoneyCost[MoneyCostType.CornPlant],
      income: MoneyCost[MoneyCostType.CornHarvest],
    });

    this.tomatoButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Tomato),
      text: "Tomato",
      onClick: () => this.onTomatoClick?.(),
    });
    this.tomatoButton.position.set(0, spacing);
    this.addChild(this.tomatoButton);
    EconomyHint.addEconomyHintToButton(this.tomatoButton, {
      cost: MoneyCost[MoneyCostType.TomatoPlant],
      income: MoneyCost[MoneyCostType.TomatoHarvest],
    });

    this.strawberryButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Strawberry),
      text: "Strawberry",
      onClick: () => this.onStrawberryClick?.(),
    });
    this.strawberryButton.position.set(0, spacing * 2);
    this.addChild(this.strawberryButton);
    EconomyHint.addEconomyHintToButton(this.strawberryButton, {
      cost: MoneyCost[MoneyCostType.StrawberryPlant],
      income: MoneyCost[MoneyCostType.StrawberryHarvest],
    });

    this.grapeButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Grape),
      text: "Grape",
      onClick: () => this.onGrapeClick?.(),
    });
    this.grapeButton.position.set(0, spacing * 3);
    this.addChild(this.grapeButton);
    EconomyHint.addEconomyHintToButton(this.grapeButton, {
      cost: MoneyCost[MoneyCostType.GrapePlant],
      income: MoneyCost[MoneyCostType.GrapeHarvest],
    });

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
    mask: number = CropPlacementMenu.All
  ): void {
    if (mask & CropPlacementMenu.Corn) this.cornButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Tomato) this.tomatoButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Grape) this.grapeButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Strawberry)
      this.strawberryButton.setEnabled(enabled);
    if (mask & CropPlacementMenu.Back) this.backButton.setEnabled(enabled);
  }
}
