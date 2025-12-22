import gsap from "gsap";
import PixiAssetsLoader, { SoundAsset } from "../../Game/PixiAssetsLoader";
import DialogButton from "./DialogButton";
import PopupBase from "./PopupBase";

export default class GameOverPopup extends PopupBase {
  private static _instance: GameOverPopup;

  private sourceButton?: DialogButton;
  private actionButton?: DialogButton;
  private onActionCallback?: () => void;

  private static readonly sourceUrl =
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

  public override init(width: number, height: number): void {
    super.init(width, height);

    if (!this.dialogBackground || !this.messageText) {
      return;
    }

    this.messageText.y = -30;

    const buttonWidth = 100;
    const buttonHeight = 40;
    const buttonSpacing = 30;

    this.sourceButton = new DialogButton({
      width: buttonWidth,
      height: buttonHeight,
      label: "Source",
      onClick: () => { this.handleSourceClick(); },
    });
    this.sourceButton.x = -buttonSpacing - buttonWidth / 2;
    this.sourceButton.y = 50;
    this.dialogBackground.addChild(this.sourceButton);

    this.actionButton = new DialogButton({
      width: buttonWidth,
      height: buttonHeight,
      label: "Restart",
      onClick: () => { this.handleActionClick(); },
    });
    this.actionButton.x = buttonSpacing + buttonWidth / 2;
    this.actionButton.y = 50;
    this.dialogBackground.addChild(this.actionButton);

    this.eventMode = "static";
    this.visible = false;
  }

  public showPopup(
    message: string,
    gameOver: boolean,
    onAction: () => void,
  ): void {
    this.messageText!.text = message;
    this.actionButton!.text = gameOver ? "Restart" : "Continue";
    this.onActionCallback = onAction;
    this.visible = true;
    this.alpha = 0;

    gsap.to(this, { alpha: 1, duration: 0.2 });
  }

  private handleSourceClick(): void {
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    window.open(GameOverPopup.sourceUrl, "_blank");
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
}
