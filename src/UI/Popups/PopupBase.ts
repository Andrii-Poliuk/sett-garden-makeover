import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";

export default class PopupBase extends Container {
  protected background?: Graphics;
  protected dialogBackground?: Graphics;
  protected messageText?: Text;
  protected layoutWidth: number = 0;
  protected layoutHeight: number = 0;

  private modalPromise: (() => void) | null = null;

  constructor() {
    super();
    this.visible = false;
  }

  public init(layoutWidth: number, layoutHeight: number, popupWidth:number = 500, popupHeight:number = 180): void {
    this.layoutWidth = layoutWidth;
    this.layoutHeight = layoutHeight;

    const popupX = layoutWidth / 2;
    const popupY = layoutHeight / 2;

    this.background = new Graphics();
    this.background.rect(0, 0, layoutWidth, layoutHeight);
    this.background.fill({ color: 0x000000, alpha: 0.5 });
    this.addChild(this.background);

    this.dialogBackground = new Graphics();
    this.dialogBackground.roundRect(
      -popupWidth / 2,
      -popupHeight / 2,
      popupWidth,
      popupHeight,
      2
    );
    this.dialogBackground.fill({ color: 0x000000, alpha: 0.9 });
    this.dialogBackground.stroke({ color: 0xaaaaaa, width: 2 });
    this.addChild(this.dialogBackground);
    this.dialogBackground.x = popupX;
    this.dialogBackground.y = popupY;

    this.messageText = new Text({
      text: "Lorem Ipsum",
      style: {
        fontFamily: "Arial",
        fontSize: 28,
        fill: "white",
        align: "center",
        wordWrap: true,
        wordWrapWidth: popupWidth - 40,
      },
    });
    this.messageText.anchor.set(0.5);
    this.dialogBackground.addChild(this.messageText);

    this.eventMode = "static";
    this.visible = false;
  }

  public async show(): Promise<void> {
    this.visible = true;
    this.alpha = 0;
    gsap.to(this, { alpha: 1, duration: 0.2 });

    return new Promise<void>((resolve) => {
      this.modalPromise = resolve;
    });
  }

  public hide(): void {
    gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      onComplete: () => {
        this.visible = false;
        if (this.modalPromise) {
          this.modalPromise();
          this.modalPromise = null;
        }
      },
    });
  }

  public resize(
    width: number,
    height: number,
    flexibleScale: number = 1
  ): void {
    if (!this.dialogBackground) return;

    const backgroundScaleX = width / this.layoutWidth;
    const backgroundScaleY = height / this.layoutHeight;
    const backgroundScale = Math.max(backgroundScaleX, backgroundScaleY);

    this.dialogBackground.x = width / 2;
    this.dialogBackground.y = height / 2;
    this.dialogBackground.scale.set(flexibleScale);
    this.background?.scale.set(backgroundScale);
  }
}
