import gsap from "gsap";
import PixiAssetsLoader, { SoundAsset } from "../../Game/PixiAssetsLoader";
import Game from "../../Game/Game";
import DialogButton from "./DialogButton";
import PopupBase from "./PopupBase";

export default class LoadingPopup extends PopupBase {
  private static _instance: LoadingPopup;

  private startButton?: DialogButton;

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

  public override init(width: number, height: number): void {
    super.init(width, height);

    if (!this.dialogBackground || !this.messageText) {
      return;
    }

    this.messageText.text = "Loading...";
    this.messageText.y = -20;

    const buttonWidth = 120;
    const buttonHeight = 40;

    this.startButton = new DialogButton({
      width: buttonWidth,
      height: buttonHeight,
      label: "Start",
      onClick: () => {
        this.handleStartClick();
      },
    });
    this.startButton.x = 0;
    this.startButton.y = 45;
    this.dialogBackground.addChild(this.startButton);

    this.eventMode = "static";
    this.visible = true;
  }

  public showLoaded(): void {
    if (this.messageText) {
      this.messageText.text = "Ready to Play?";
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
}
