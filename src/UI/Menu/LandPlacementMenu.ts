import { Graphics, Sprite } from "pixi.js";
import SpriteButton from "../SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";
import MenuBase from "./MenuBase";

export default class LandPlacementMenu extends MenuBase {
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
    const spacing = 80;

    this.croplandButton = new SpriteButton({
      texture: PixiAsset.Corn,
      text: "Cropland",
      onClick: () => this.onCroplandClick?.(),
    });
    this.croplandButton.position.set(0, 0);
    this.overrideButtonSprite(this.croplandButton);
    this.addChild(this.croplandButton);

    this.cattlePenButton = new SpriteButton({
      texture: PixiAsset.Cow,
      text: "Cattle Pen",
      onClick: () => this.onCattlePenClick?.(),
    });
    this.cattlePenButton.position.set(0, spacing);
    this.overrideButtonSprite(this.cattlePenButton);
    this.addChild(this.cattlePenButton);

    this.backButton = new SpriteButton({
      texture: PixiAsset.SkipDay,
      text: "Back",
      onClick: () => this.onBackClick?.(),
    });
    this.backButton.position.set(0, spacing * 2);
    this.addChild(this.backButton);
    const backButtonScale = this.backButton.spriteScale;
    this.backButton.spriteScale = { x: -backButtonScale.x, y: backButtonScale.y };
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

  private overrideButtonSprite(button: SpriteButton): void {
    const currentScale = button.spriteScale;
    button.spriteScale = {x: currentScale.x * 0.8, y: currentScale.y * 0.8};
    const iconRect = button.getSpriteRect();

    const cornerRadius = 6;
    const padding = 2;

    const background = new Graphics();
    background.roundRect(
      -iconRect.width / 2 - padding,
      -iconRect.height / 2 - padding,
      iconRect.width + padding * 2,
      iconRect.height + padding * 2,
      cornerRadius,
    );
    background.stroke({ color: 0xffffff, width: 2 });

    button.addChildAt(background, 1);
    background.x = iconRect.x;
    background.y = iconRect.y;

    const plusSprite = new Sprite(
      PixiAssetsLoader.instance.getTexture(PixiAsset.Plus),
    );
    plusSprite.scale = 0.1;
    plusSprite.anchor.set(0.5);
    button.addChild(plusSprite);
    plusSprite.x = iconRect.x + iconRect.width * 0.5;
    plusSprite.y = iconRect.y + iconRect.height * 0.25;
  }
}
