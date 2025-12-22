import { Container } from "pixi.js";
import SpriteButton from "../SpriteButton";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";
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
    this.moneyDisplay.setOriginalPosition(0);
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

    this.position.set(window.innerWidth - 180, 40);
  }

  public setEnabled(enabled: boolean): void {
    this.skipDayButton.setEnabled(enabled);
  }

  public static readonly Money = 1 << 0;
  public static readonly SkipDay = 1 << 1;
  public static readonly Income = 1 << 2;
  public static readonly All =
    GameControls.Money | GameControls.SkipDay | GameControls.Income;

  public show(mask: number = GameControls.All): void {
    if (mask & GameControls.Money) this.moneyDisplay.visible = true;
    if (mask & GameControls.SkipDay) this.skipDayButton.visible = true;
    if (mask & GameControls.Income) this.incomeContainer.visible = true;
  }

  public hide(mask: number = GameControls.All): void {
    if (mask & GameControls.Money) this.moneyDisplay.visible = false;
    if (mask & GameControls.SkipDay) this.skipDayButton.visible = false;
    if (mask & GameControls.Income) this.incomeContainer.visible = false;
  }

  public setMoney(amount: number): void {
    this.moneyDisplay.setAmount(amount);
  }

  public resize(width: number, _height: number, flexibleScale: number): void {
    this.scale.set(flexibleScale);
    this.position.set(width - 180 * flexibleScale, 40 * flexibleScale);
  }
}
