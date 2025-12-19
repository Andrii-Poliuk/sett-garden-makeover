import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";
import PixiAssetsLoader, { SoundAsset } from "../Game/PixiAssetsLoader";

export default class GameOverPopup extends Container {
  private static _instance: GameOverPopup;

  private background?: Graphics;
  private dialogBackground?: Graphics;
  private messageText?: Text;
  private sourceButton?: Graphics;
  private actionButton?: Graphics;
  private actionButtonText?: Text;
  private onActionCallback?: () => void;
  private originalWidth: number = 0;
  private originalHeight: number = 0;

  private static readonly SOURCE_URL =
    "https://github.com/Andrii-Poliuk/sett-garden-makeover";

  public static get instance(): GameOverPopup {
    if (!GameOverPopup._instance) {
      GameOverPopup._instance = new GameOverPopup();
    }
    return GameOverPopup._instance;
  }

  private constructor() {
    super();
    this.visible = false;
  }

  public init(width: number, height: number): void {
    this.originalWidth = width;
    this.originalHeight = height;

    const popupWidth = Math.min(500, width - 40);
    const popupHeight = 240;
    const popupX = width / 2;
    const popupY = height / 2;

    this.background = new Graphics();
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0x000000, alpha: 0.5 });
    this.addChild(this.background);

    this.dialogBackground = new Graphics();
    this.dialogBackground.rect(
      -popupWidth / 2,
      -popupHeight / 2,
      popupWidth,
      popupHeight,
    );
    this.dialogBackground.fill({ color: 0x000000, alpha: 0.9 });
    this.dialogBackground.stroke({ color: 0xaaaaaa, width: 2 });
    this.addChild(this.dialogBackground);
    this.dialogBackground.x = popupX;
    this.dialogBackground.y = popupY;

    this.messageText = new Text({
      text: "",
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
    this.messageText.y = -30;
    this.dialogBackground.addChild(this.messageText);

    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonSpacing = 30;

    this.sourceButton = new Graphics();
    this.sourceButton.rect(
      -buttonWidth / 2,
      -buttonHeight / 2,
      buttonWidth,
      buttonHeight,
    );
    this.sourceButton.fill({ color: 0x222222 });
    this.sourceButton.stroke({ color: 0x888888, width: 1 });
    this.sourceButton.x = -buttonSpacing - buttonWidth / 2;
    this.sourceButton.y = 50;
    this.sourceButton.eventMode = "static";
    this.sourceButton.cursor = "pointer";
    this.sourceButton.on("pointerdown", this.handleSourceClick, this);
    this.dialogBackground.addChild(this.sourceButton);

    const sourceText = new Text({
      text: "Source",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
      },
    });
    sourceText.anchor.set(0.5);
    this.sourceButton.addChild(sourceText);

    this.actionButton = new Graphics();
    this.actionButton.rect(
      -buttonWidth / 2,
      -buttonHeight / 2,
      buttonWidth,
      buttonHeight,
    );
    this.actionButton.fill({ color: 0x222222 });
    this.actionButton.stroke({ color: 0x888888, width: 1 });
    this.actionButton.x = buttonSpacing + buttonWidth / 2;
    this.actionButton.y = 50;
    this.actionButton.eventMode = "static";
    this.actionButton.cursor = "pointer";
    this.actionButton.on("pointerdown", this.handleActionClick, this);
    this.dialogBackground.addChild(this.actionButton);

    this.actionButtonText = new Text({
      text: "Continue",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
      },
    });
    this.actionButtonText.anchor.set(0.5);
    this.actionButton.addChild(this.actionButtonText);

    this.eventMode = "static";
    this.visible = false;
  }

  public showPopup(
    message: string,
    gameOver: boolean,
    onAction: () => void,
  ): void {
    this.messageText!.text = message;
    this.actionButtonText!.text = gameOver ? "Restart" : "Continue";
    this.onActionCallback = onAction;
    this.visible = true;
    this.alpha = 0;

    gsap.to(this, { alpha: 1, duration: 0.2 });
  }

  private handleSourceClick(): void {
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    window.open(GameOverPopup.SOURCE_URL, "_blank");
  }

  private handleActionClick(): void {
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      onComplete: () => {
        this.visible = false;
        this.onActionCallback?.();
        this.onActionCallback = undefined;
      },
    });
  }

  public resize(
    width: number,
    height: number,
    flexibleScale: number = 1,
  ): void {
    if (!this.dialogBackground) return;

    const backgroundScaleX = width / this.originalWidth;
    const backgroundScaleY = height / this.originalHeight;
    const backgroundScale = Math.max(backgroundScaleX, backgroundScaleY);

    this.dialogBackground.x = width / 2;
    this.dialogBackground.y = height / 2;
    this.dialogBackground.scale.set(flexibleScale);
    this.background?.scale.set(backgroundScale);
  }
}
