import PixiAssetsLoader, { SoundAsset } from "../../Game/PixiAssetsLoader";
import PopupBase from "./PopupBase";

export default class DialogPopup extends PopupBase {
  private static _instance: DialogPopup;

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

  public override init(width: number, height: number): void {
    const popupWidth = 580;
    const popupHeight = 180;
    super.init(width, height, popupWidth, popupHeight);

    if (!this.dialogBackground || !this.messageText) {
      return;
    }
    this.dialogBackground.y = height - popupHeight / 2 - 60;

    this.messageText.text = "";

    this.eventMode = "static";
    this.on("pointerdown", this.handleClick, this);

    this.visible = false;
  }

  public async showPopup(message: string): Promise<void> {
    this.messageText!.text = message;
    await super.show();
  }

  private handleClick(): void {
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    super.hide();
  }

  public resize(width: number, height: number, scale: number): void {
    super.resize(width, height, scale);
    if (!this.dialogBackground) {
      return;
    }
    const popupHeight = 180;
    const popupX = width / 2;
    const popupY = height - (popupHeight / 2) * scale - 40;
    this.dialogBackground.x = popupX;
    this.dialogBackground.y = popupY;
    this.dialogBackground.scale.set(scale);
  }
}
