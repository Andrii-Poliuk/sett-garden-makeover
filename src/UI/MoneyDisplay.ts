import { Container, Sprite, Text } from "pixi.js";
import PixiAssetsLoader, { PixiAsset } from "./PixiAssetsLoader";

export default class MoneyDisplay extends Container {
  private amountText!: Text;
  private moneySprite!: Sprite;

  constructor() {
    super();
    this.label = "MoneyDisplay";
  }

  public init(): void {
    const assets = PixiAssetsLoader.instance;

    this.amountText = new Text({
      text: "0",
      style: {
        fontFamily: "Arial",
        fontSize: 28,
        fill: "white",
        align: "right",
      },
    });
    this.amountText.anchor.set(1, 0.5);
    this.addChild(this.amountText);

    this.moneySprite = new Sprite(assets.getTexture(PixiAsset.Money));
    this.moneySprite.scale.set(0.3);
    this.moneySprite.anchor.set(0, 0.5);
    this.moneySprite.x = 10;
    this.addChild(this.moneySprite);
  }

  public setAmount(amount: number): void {
    this.amountText.text = amount.toString();
  }
}
