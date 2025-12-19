import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";
import PixiAssetsLoader, { SoundAsset } from "../Game/PixiAssetsLoader";

export default class ConfirmationPopup extends Container {
  private static _instance: ConfirmationPopup;

  private background?: Graphics;
  private dialogBackground?: Graphics;
  private messageText?: Text;
  private yesButton?: Graphics;
  private noButton?: Graphics;
  private onYesCallback?: () => void;
  private originalWidth: number = 0;
  private originalHeight: number = 0;

  public static get instance(): ConfirmationPopup {
    if (!ConfirmationPopup._instance) {
      ConfirmationPopup._instance = new ConfirmationPopup();
    }
    return ConfirmationPopup._instance;
  }

  private constructor() {
    super();
    this.visible = false;
  }

  public init(width: number, height: number): void {
    this.originalWidth = width;
    this.originalHeight = height;

    const popupWidth = Math.min(500, width - 40);
    const popupHeight = 180;
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
      popupHeight
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

    this.yesButton = new Graphics();
    this.yesButton.rect(
      -buttonWidth / 2,
      -buttonHeight / 2,
      buttonWidth,
      buttonHeight
    );
    this.yesButton.fill({ color: 0x222222 });
    this.yesButton.stroke({ color: 0x888888, width: 1 });
    this.yesButton.x = -buttonSpacing - buttonWidth / 2;
    this.yesButton.y = 50;
    this.yesButton.eventMode = "static";
    this.yesButton.cursor = "pointer";
    this.yesButton.on("pointerdown", this.handleYesClick, this);
    this.dialogBackground.addChild(this.yesButton);

    const yesText = new Text({
      text: "Yes",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
      },
    });
    yesText.anchor.set(0.5);
    this.yesButton.addChild(yesText);

    this.noButton = new Graphics();
    this.noButton.rect(
      -buttonWidth / 2,
      -buttonHeight / 2,
      buttonWidth,
      buttonHeight
    );
    this.noButton.fill({ color: 0x222222 });
    this.noButton.stroke({ color: 0x888888, width: 1 });
    this.noButton.x = buttonSpacing + buttonWidth / 2;
    this.noButton.y = 50;
    this.noButton.eventMode = "static";
    this.noButton.cursor = "pointer";
    this.noButton.on("pointerdown", this.handleNoClick, this);
    this.dialogBackground.addChild(this.noButton);

    const noText = new Text({
      text: "No",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
      },
    });
    noText.anchor.set(0.5);
    this.noButton.addChild(noText);

    this.eventMode = "static";
    this.visible = false;
  }

  public showPopup(message: string, onYes: () => void): void {
    this.messageText!.text = message;
    this.onYesCallback = onYes;
    this.visible = true;
    this.alpha = 0;

    gsap.to(this, { alpha: 1, duration: 0.2 });
  }

  private handleYesClick(): void {
    const click = PixiAssetsLoader.instance.getSound(SoundAsset.Click);
    click && click.play();
    gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      onComplete: () => {
        this.visible = false;
        this.onYesCallback?.();
        this.onYesCallback = undefined;
      },
    });
  }

  private handleNoClick(): void {
    const click = PixiAssetsLoader.instance.getSound(SoundAsset.Click);
    click && click.play();
    gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      onComplete: () => {
        this.visible = false;
        this.onYesCallback = undefined;
      },
    });
  }

  public resize(width: number, height: number): void {
    if (!this.dialogBackground) return;

    const scaleX = width / this.originalWidth;
    const scaleY = height / this.originalHeight;
    const dialogScale = Math.min(scaleX, scaleY);
    const backgroundScale = Math.max(scaleX, scaleY);

    this.dialogBackground.x = width / 2;
    this.dialogBackground.y = height / 2;
    this.dialogBackground.scale.set(dialogScale);
    this.background?.scale.set(backgroundScale);
  }
}
