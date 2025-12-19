import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";
import PixiAssetsLoader, { SoundAsset } from "../Game/PixiAssetsLoader";
import Game from "../Game/Game";

export default class LoadingPopup extends Container {
  private static _instance: LoadingPopup;

  private background?: Graphics;
  private dialogBackground?: Graphics;
  private loadingText?: Text;
  private startButton?: Graphics;
  private originalWidth: number = 0;
  private originalHeight: number = 0;

  public static get instance(): LoadingPopup {
    if (!LoadingPopup._instance) {
      LoadingPopup._instance = new LoadingPopup();
    }
    return LoadingPopup._instance;
  }

  private constructor() {
    super();
    this.visible = true;
  }

  public init(width: number, height: number): void {
    this.originalWidth = width;
    this.originalHeight = height;

    const popupWidth = Math.min(400, width - 40);
    const popupHeight = 180;
    const popupX = width / 2;
    const popupY = height / 2;

    this.background = new Graphics();
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0x000000, alpha: 0.7 });
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

    this.loadingText = new Text({
      text: "Loading...",
      style: {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white",
        align: "center",
      },
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.y = -20;
    this.dialogBackground.addChild(this.loadingText);

    const buttonWidth = 120;
    const buttonHeight = 50;

    this.startButton = new Graphics();
    this.startButton.rect(
      -buttonWidth / 2,
      -buttonHeight / 2,
      buttonWidth,
      buttonHeight,
    );
    this.startButton.fill({ color: 0x222222 });
    this.startButton.stroke({ color: 0x888888, width: 1 });
    this.startButton.x = 0;
    this.startButton.y = 40;
    this.startButton.eventMode = "static";
    this.startButton.cursor = "pointer";
    this.startButton.visible = false;
    this.startButton.on("pointerdown", this.handleStartClick, this);
    this.dialogBackground.addChild(this.startButton);

    const startText = new Text({
      text: "Start",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
      },
    });
    startText.anchor.set(0.5);
    this.startButton.addChild(startText);

    this.eventMode = "static";
    this.visible = true;
  }

  public showLoaded(): void {
    if (this.loadingText) {
      this.loadingText.text = "Ready!";
    }
    if (this.startButton) {
      this.startButton.visible = true;
      this.startButton.alpha = 0;
      gsap.to(this.startButton, { alpha: 1, duration: 0.3 });
    }
  }

  private handleStartClick(): void {
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    gsap.to(this, {
      alpha: 0,
      duration: 0.3,
      onComplete: () => {
        this.visible = false;
        Game.instance.startGame();
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
