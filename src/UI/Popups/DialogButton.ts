import { Container, FederatedPointerEvent, Graphics, Text } from "pixi.js";
import PixiAssetsLoader, { SoundAsset } from "../../Game/PixiAssetsLoader";

export interface DialogButtonOptions {
  width: number;
  height: number;
  label: string;
  onClick: () => void;
}

export default class DialogButton extends Container {
  private onClick: () => void;
  private background: Graphics;
  private buttonText: Text;
  private originalScale: number = 1;
  private pressedScale: number = 1.03;
  private backAlpha: number = 0.6;
  private hoverAlpha: number = 1;

  public get text(): string {
    return this.buttonText.text;
  }

  public set text(value: string) {
    this.buttonText.text = value;
  }

  constructor(options: DialogButtonOptions) {
    super();

    this.onClick = options.onClick;

    this.background = new Graphics();
    this.background.roundRect(
      -options.width / 2,
      -options.height / 2,
      options.width,
      options.height,
      2,
    );
    this.background.fill({ color: 0x222222 });
    this.background.stroke({ color: 0x888888, width: 1 });
    this.addChild(this.background);
    this.background.alpha = this.backAlpha;

    this.buttonText = new Text({
      text: options.label,
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
      },
    });
    this.buttonText.anchor.set(0.5);
    this.addChild(this.buttonText);

    this.eventMode = "static";
    // this.cursor = "pointer";
    this.on("pointerdown", this.handlePointerDown, this);
    this.on("pointerup", this.handlePointerUp, this);
    this.on("pointerover", this.handleHover, this);
    this.on("pointerout", this.handleHoverEnd, this);
  }

  private isValidPointer(event: FederatedPointerEvent): boolean {
    return event.pointerType === "touch" || event.button === 0;
  }

  private handlePointerDown(event: FederatedPointerEvent): void {
    if (!this.isValidPointer(event)) return;
    this.scale.set(this.pressedScale);
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
  }

  private handlePointerUp(event: FederatedPointerEvent): void {
    if (!this.isValidPointer(event)) return;
    this.scale.set(this.originalScale);
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    this.onClick();
  }

  private handleHover(): void {
    this.background.alpha = this.hoverAlpha;
  }

  private handleHoverEnd(): void {
    this.background.alpha = this.backAlpha;
    this.scale.set(this.originalScale);
  }
}
