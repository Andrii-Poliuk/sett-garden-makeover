import SpriteButton from "../SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";
import MenuBase from "./MenuBase";
import EconomyHint from "../EconomyHint";
import MoneyCost, { getMoneyCost, MoneyCostType } from "../../Game/MoneyCost";

export default class CattlePlacementMenu extends MenuBase {
  private cowButton!: SpriteButton;
  private sheepButton!: SpriteButton;
  private backButton!: SpriteButton;

  public onCowClick?: () => void;
  public onSheepClick?: () => void;
  public onBackClick?: () => void;

  constructor() {
    super();
    this.label = "CattlePlacementMenu";
    this.interactive = true;
  }

  public init(): void {
    const assets = PixiAssetsLoader.instance;
    const spacing = 80;

    this.cowButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Cow),
      text: "Cow",
      onClick: () => this.onCowClick?.(),
    });
    this.cowButton.position.set(0, 0);
    this.addChild(this.cowButton);
      EconomyHint.addEconomyHintToButton(this.cowButton, {
      cost: MoneyCost[MoneyCostType.CowBuy],
      income: MoneyCost[MoneyCostType.CowDaily],
    });

    this.sheepButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Sheep),
      text: "Sheep",
      onClick: () => this.onSheepClick?.(),
    });
    this.sheepButton.position.set(0, spacing);
    this.addChild(this.sheepButton);
      EconomyHint.addEconomyHintToButton(this.sheepButton, {
      cost: MoneyCost[MoneyCostType.SheepBuy],
      income: MoneyCost[MoneyCostType.SheepDaily],
    });

    this.backButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.SkipDay),
      text: "Back",
      onClick: () => this.onBackClick?.(),
    });
    this.backButton.position.set(0, spacing * 2);
    this.addChild(this.backButton);
    const backButtonScale = this.backButton.sprite.scale;
    this.backButton.sprite.scale.set(-backButtonScale.x, backButtonScale.y);
  }

  public static readonly Cow = 1 << 0;
  public static readonly Sheep = 1 << 1;
  public static readonly Back = 1 << 2;
  public static readonly All =
    CattlePlacementMenu.Cow |
    CattlePlacementMenu.Sheep |
    CattlePlacementMenu.Back;

  public setEnabled(
    enabled: boolean,
    mask: number = CattlePlacementMenu.All,
  ): void {
    if (mask & CattlePlacementMenu.Cow) this.cowButton.setEnabled(enabled);
    if (mask & CattlePlacementMenu.Sheep) this.sheepButton.setEnabled(enabled);
    if (mask & CattlePlacementMenu.Back) this.backButton.setEnabled(enabled);
  }
}
