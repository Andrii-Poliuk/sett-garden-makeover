import { Container } from "pixi.js";
import SpriteButton from "./SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "./PixiAssetsLoader";
import MoneyDisplay from "./MoneyDisplay";

export default class GameControls extends Container {
  private moneyDisplay!: MoneyDisplay;
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

    this.moneyDisplay = new MoneyDisplay();
    this.moneyDisplay.init();
    this.moneyDisplay.position.set(0, 0);
    this.addChild(this.moneyDisplay);

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
    if (mask & GameControls.MONEY) this.moneyDisplay.visible = true;
    if (mask & GameControls.SKIP_DAY) this.skipDayButton.visible = true;
    if (mask & GameControls.INCOME) this.incomeContainer.visible = true;
  }

  public hide(mask: number = GameControls.ALL): void {
    if (mask & GameControls.MONEY) this.moneyDisplay.visible = false;
    if (mask & GameControls.SKIP_DAY) this.skipDayButton.visible = false;
    if (mask & GameControls.INCOME) this.incomeContainer.visible = false;
  }

  public setMoney(amount: number): void {
    this.moneyDisplay.setAmount(amount);
  }
}
