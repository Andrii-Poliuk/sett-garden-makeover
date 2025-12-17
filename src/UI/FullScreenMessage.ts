import { Container, Graphics, Text } from "pixi.js";

export default class FullScreenMessage extends Container {
  private static _instance: FullScreenMessage;

  private background: Graphics;
  private messageText: Text;
  private resolvePromise: (() => void) | null = null;

  private constructor() {
    super();

    this.background = new Graphics();
    this.background.rect(0, 0, 1, 1);
    this.background.fill({ color: 0x000000, alpha: 0.7 });
    this.addChild(this.background);

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
    this.addChild(this.messageText);

    this.eventMode = "static";
    this.on("pointerdown", this.handleClick, this);

    this.visible = false;
  }

  public static get instance(): FullScreenMessage {
    if (!FullScreenMessage._instance) {
      FullScreenMessage._instance = new FullScreenMessage();
    }
    return FullScreenMessage._instance;
  }

  public async showPopup(message: string): Promise<void> {
    this.messageText.text = message;
    this.visible = true;

    return new Promise<void>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  private handleClick(): void {
    if (this.resolvePromise) {
      this.resolvePromise();
      this.resolvePromise = null;
    }
    this.visible = false;
  }

  public resize(width: number, height: number): void {
    this.background.clear();
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0x000000, alpha: 0.7 });

    this.messageText.position.set(width / 2, height / 2);
  }
}
