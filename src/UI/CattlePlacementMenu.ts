import { Container } from "pixi.js";
import SpriteButton from "./SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "./PixiAssetsLoader";

export default class CattlePlacementMenu extends Container {
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

    this.sheepButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.Sheep),
      text: "Sheep",
      onClick: () => this.onSheepClick?.(),
    });
    this.sheepButton.position.set(0, spacing);
    this.addChild(this.sheepButton);

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

  public static readonly COW = 1 << 0;
  public static readonly SHEEP = 1 << 1;
  public static readonly BACK = 1 << 2;
  public static readonly ALL = CattlePlacementMenu.COW | CattlePlacementMenu.SHEEP | CattlePlacementMenu.BACK;

  public setEnabled(enabled: boolean, mask: number = CattlePlacementMenu.ALL): void {
    if (mask & CattlePlacementMenu.COW) this.cowButton.setEnabled(enabled);
    if (mask & CattlePlacementMenu.SHEEP) this.sheepButton.setEnabled(enabled);
    if (mask & CattlePlacementMenu.BACK) this.backButton.setEnabled(enabled);
  }
}
