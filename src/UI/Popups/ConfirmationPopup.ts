import gsap from "gsap";
import PixiAssetsLoader, { SoundAsset } from "../../Game/PixiAssetsLoader";
import DialogButton from "./DialogButton";
import PopupBase from "./PopupBase";

export default class ConfirmationPopup extends PopupBase {
  private static _instance: ConfirmationPopup;

  private yesButton?: DialogButton;
  private noButton?: DialogButton;
  private onYesCallback?: () => void;

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

  public override init(width: number, height: number): void {
    super.init(width, height);

    if (!this.dialogBackground || !this.messageText) {
      return;
    }

    this.messageText.y = -30;

    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonSpacing = 30;

    this.yesButton = new DialogButton({
      width: buttonWidth,
      height: buttonHeight,
      label: "Yes",
      onClick: () => { this.handleYesClick(); },
    });
    this.yesButton.x = -buttonSpacing - buttonWidth / 2;
    this.yesButton.y = 50;
    this.dialogBackground.addChild(this.yesButton);

    this.noButton = new DialogButton({
      width: buttonWidth,
      height: buttonHeight,
      label: "No",
      onClick: () => { this.handleNoClick(); },
    });
    this.noButton.x = buttonSpacing + buttonWidth / 2;
    this.noButton.y = 50;
    this.dialogBackground.addChild(this.noButton);

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
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
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
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    gsap.to(this, {
      alpha: 0,
      duration: 0.2,
      onComplete: () => {
        this.visible = false;
        this.onYesCallback = undefined;
      },
    });
  }
}
