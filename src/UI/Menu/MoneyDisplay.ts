import { Container, Sprite, Text } from "pixi.js";
import gsap from "gsap";
import PixiAssetsLoader, { PixiAsset } from "../../Game/PixiAssetsLoader";

export default class MoneyDisplay extends Container {
  private amountText!: Text;
  private moneySprite!: Sprite;
  private currentTween: gsap.core.Tween | null = null;
  private originalX: number = 0;

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
        fontSize: 34,
        fill: "white",
        stroke: { color: "#303030", width: 1 },
        align: "right",
      },
    });
    this.amountText.anchor.set(1, 0.5);
    this.amountText.x = 75;
    this.addChild(this.amountText);

    this.moneySprite = new Sprite(assets.getTexture(PixiAsset.Money));
    this.moneySprite.scale.set(0.4);
    this.moneySprite.anchor.set(0, 0.5);
    this.moneySprite.x = 85;
    this.addChild(this.moneySprite);
  }

  public setAmount(amount: number): void {
    this.amountText.text = amount.toString();
    this.playShakeAnimation();
  }

  private playShakeAnimation(): void {
    this.killCurrentTween();
    this.currentTween = gsap.to(this, {
      x: this.originalX + 5,
      duration: 0.05,
      yoyo: true,
      repeat: 3,
      ease: "power1.inOut",
      onComplete: () => {
        this.x = this.originalX;
        this.currentTween = null;
      },
    });
  }

  private killCurrentTween(): void {
    if (this.currentTween) {
      this.currentTween.kill();
      this.currentTween = null;
      this.x = this.originalX;
    }
  }

  public setOriginalPosition(x: number): void {
    this.originalX = x;
  }
}
