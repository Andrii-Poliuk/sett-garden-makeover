import { Container } from "pixi.js";
import SpriteButton from "./SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "./PixiAssetsLoader";

export default class GameControls extends Container {
  private moneyContainer!: Container;
  private skipDayButton!: SpriteButton;
  private incomeContainer!: Container;

  public onSkipDayClick?: () => void;

  constructor() {
    super();
    this.label = "GameControls";
  }

  public init(): void {
    const assets = PixiAssetsLoader.instance;
    const spacing = 80;

    this.moneyContainer = new Container();
    this.moneyContainer.label = "MoneyContainer";
    this.moneyContainer.position.set(0, 0);
    this.addChild(this.moneyContainer);

    this.skipDayButton = new SpriteButton({
      texture: assets.getTexture(PixiAsset.SkipDay),
      text: "Skip Day",
      onClick: () => this.onSkipDayClick?.(),
    });
    this.skipDayButton.position.set(0, spacing);
    this.addChild(this.skipDayButton);

    this.incomeContainer = new Container();
    this.incomeContainer.label = "IncomeContainer";
    this.incomeContainer.position.set(0, spacing * 2);
    this.addChild(this.incomeContainer);
  }

  public setEnabled(enabled: boolean): void {
    this.skipDayButton.setEnabled(enabled);
  }

  public static readonly MONEY = 1 << 0;
  public static readonly SKIP_DAY = 1 << 1;
  public static readonly INCOME = 1 << 2;
  public static readonly ALL = GameControls.MONEY | GameControls.SKIP_DAY | GameControls.INCOME;

  public show(mask: number = GameControls.ALL): void {
    if (mask & GameControls.MONEY) this.moneyContainer.visible = true;
    if (mask & GameControls.SKIP_DAY) this.skipDayButton.visible = true;
    if (mask & GameControls.INCOME) this.incomeContainer.visible = true;
  }

  public hide(mask: number = GameControls.ALL): void {
    if (mask & GameControls.MONEY) this.moneyContainer.visible = false;
    if (mask & GameControls.SKIP_DAY) this.skipDayButton.visible = false;
    if (mask & GameControls.INCOME) this.incomeContainer.visible = false;
  }
}
