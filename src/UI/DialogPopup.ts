import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";

export default class DialogPopup extends Container {
  private static _instance: DialogPopup;

  private background?: Graphics;
  private dialogBackground?: Graphics;
  private messageText?: Text;
  private resolvePromise: (() => void) | null = null;
  private originalWidth: number = 0;
  private originalHeight: number = 0;

    public static get instance(): DialogPopup {
    if (!DialogPopup._instance) {
      DialogPopup._instance = new DialogPopup();
    }
    return DialogPopup._instance;
  }


  private constructor() {
    super();

    this.visible = false;
  }

    public init(width: number, height: number): void {
    this.originalWidth = width;
    this.originalHeight = height;

    const popupWidth = Math.min(600, width - 40);
    const popupHeight = 120;
    const popupX = (width) / 2;
    const popupY = height - popupHeight - 40;

    this.background = new Graphics();
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0x000000, alpha: 0.1 });
    this.addChild(this.background);

    this.dialogBackground = new Graphics();
    this.dialogBackground.rect(-popupWidth/2, -popupHeight/2, popupWidth, popupHeight);
    this.dialogBackground.fill({ color: 0x000000, alpha: 0.8 });
    this.dialogBackground.stroke({ color: 0xaaaaaa, width: 2 });
    this.addChild(this.dialogBackground);
    this.dialogBackground.x = popupX;
    this.dialogBackground.y = popupY;

    this.messageText = new Text({
      text: "",
      style: {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white",
        align: "center",
        wordWrap: true,
        wordWrapWidth: 600,
      },
    });
    this.messageText.anchor.set(0.5);
    this.dialogBackground.addChild(this.messageText);

    this.eventMode = "static";
    this.on("pointerdown", this.handleClick, this);

    this.visible = false;
  }

  public async showPopup(message: string): Promise<void> {
    this.messageText!.text = message;
    this.visible = true;
    this.alpha = 0;

    gsap.to(this, { alpha: 1, duration: 0.2 });

    return new Promise<void>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  private handleClick(): void {
    gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      onComplete: () => {
        this.visible = false;
        if (this.resolvePromise) {
          this.resolvePromise();
          this.resolvePromise = null;
        }
      },
    });
  }

  public resize(width: number, height: number): void {
    if (!this.visible) return;
    if (!this.dialogBackground) return;

    const scaleX = width / this.originalWidth;
    const scaleY = height / this.originalHeight;
    const dialogScale = Math.min(scaleX, scaleY);
    const backgroundScale = Math.max(scaleX, scaleY);

    const popupHeight = 120;
    const popupX = width / 2;
    const popupY = height - popupHeight * dialogScale - 40;

    this.dialogBackground.x = popupX;
    this.dialogBackground.y = popupY;
    this.dialogBackground.scale.set(dialogScale);
    this.background?.scale.set(backgroundScale);
  }
}
