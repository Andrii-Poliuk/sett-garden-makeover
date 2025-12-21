import { Graphics, Text } from "pixi.js";
import PixiAssetsLoader, { SoundAsset } from "../../Game/PixiAssetsLoader";

export interface DialogButtonOptions {
  width: number;
  height: number;
  label: string;
  onClick: () => void;
}

export default class DialogButton extends Graphics {
  private onClick: () => void;
  private buttonText: Text;

  public get text(): string {
    return this.buttonText.text;
  }

  public set text(value: string) {
    this.buttonText.text = value;
  }

  constructor(options: DialogButtonOptions) {
    super();

    this.onClick = options.onClick;

    this.rect(
      -options.width / 2,
      -options.height / 2,
      options.width,
      options.height,
    );
    this.fill({ color: 0x222222 });
    this.stroke({ color: 0x888888, width: 1 });

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
    this.cursor = "pointer";
    this.on("pointerdown", this.handleClick, this);
  }

  private handleClick(): void {
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    this.onClick();
  }
}
