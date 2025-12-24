import { Graphics, Sprite } from "pixi.js";
import SpriteButton from "../SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";
import MenuBase from "./MenuBase";
import EconomyHint from "../EconomyHint";
import MoneyCost, { MoneyCostType } from "../../Game/MoneyCost";

export default class LandPlacementMenu extends MenuBase {
  private croplandButton!: SpriteButton;
  private cattlePenButton!: SpriteButton;
  private backButton!: SpriteButton;

  private croplandHint?: EconomyHint;
  private cattlePenHint?: EconomyHint;

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
    this.overrideButtonSprite(this.croplandButton);
    this.addChild(this.croplandButton);
    this.croplandHint = EconomyHint.addEconomyHintToButton(
      this.croplandButton,
      {
        cost: MoneyCost[MoneyCostType.GroundMake],
        income: 0,
      },
    );

    this.cattlePenButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Sheep),
      text: "Cattle Pen",
      onClick: () => this.onCattlePenClick?.(),
    });
    this.cattlePenButton.position.set(0, spacing);
    this.overrideButtonSprite(this.cattlePenButton);
    this.addChild(this.cattlePenButton);
    this.cattlePenHint = EconomyHint.addEconomyHintToButton(
      this.cattlePenButton,
      {
        cost: MoneyCost[MoneyCostType.FenceMake],
        income: 0,
      },
    );

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

  public static readonly Cropland = 1 << 0;
  public static readonly CattlePen = 1 << 1;
  public static readonly Back = 1 << 2;
  public static readonly All =
    LandPlacementMenu.Cropland |
    LandPlacementMenu.CattlePen |
    LandPlacementMenu.Back;

  public setEnabled(
    enabled: boolean,
    mask: number = LandPlacementMenu.All,
  ): void {
    if (mask & LandPlacementMenu.Cropland)
      this.croplandButton.setEnabled(enabled);
    if (mask & LandPlacementMenu.CattlePen)
      this.cattlePenButton.setEnabled(enabled);
    if (mask & LandPlacementMenu.Back) this.backButton.setEnabled(enabled);
  }

  public setHintsVisible(visible: boolean): void {
    if (this.croplandHint) {
      this.croplandHint.visible = visible;
    }
    if (this.cattlePenHint) {
      this.cattlePenHint.visible = visible;
    }
  }

  private overrideButtonSprite(button: SpriteButton): void {
    const sprite = button.sprite;
    const currentScale = sprite.scale;
    sprite.scale.set(currentScale.x * 0.8, currentScale.y * 0.8);

    const bounds = sprite.getBounds();
    const cornerRadius = 6;
    const padding = 2;

    const background = new Graphics();
    background.roundRect(
      -bounds.width / 2 - padding,
      -bounds.height / 2 - padding,
      bounds.width + padding * 2,
      bounds.height + padding * 2,
      cornerRadius,
    );
    background.stroke({ color: 0xffffff, width: 2 });

    button.addChildAt(background, button.getChildIndex(sprite));
    background.x = sprite.x;
    background.y = sprite.y;

    const plusSprite = new Sprite(
      PixiAssetsLoader.instance.getTexture(PixiAsset.Plus),
    );
    plusSprite.scale = 0.1;
    plusSprite.anchor.set(0.5);
    button.addChild(plusSprite);
    plusSprite.x = sprite.x + bounds.width * 0.5;
    plusSprite.y = sprite.y + bounds.height * 0.25;
  }
}
