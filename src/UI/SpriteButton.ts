import {
  Container,
  Graphics,
  Sprite,
  Text,
  Texture,
  TextStyle,
  ColorMatrixFilter,
} from "pixi.js";

export interface SpriteButtonOptions {
  texture: Texture;
  text?: string;
  textStyle?: Partial<TextStyle>;
  onClick?: () => void;
}

export default class SpriteButton extends Container {
  private _sprite: Sprite;
  private buttonLabel: Text;
  private disabledColorMatrix: ColorMatrixFilter;

  public get sprite(): Sprite {
    return this._sprite;
  }
  private hitZone: Graphics;
  private onClick: (() => void) | undefined;

  public setEnabled(enabled: boolean) {
    this.interactive = enabled;
    if (enabled) {
      this.sprite.filters = undefined;
    } else {
      this.sprite.filters = this.disabledColorMatrix;
    }
  }

  constructor(options: SpriteButtonOptions) {
    super();

    if (options.text) {
      this.label = options.text;
    }

    this.onClick = options.onClick;

    this.interactive = true;
    this.hitZone = new Graphics();
    this.hitZone.rect(-30, -30, 200, 60);
    this.hitZone.fill({ color: 0xffffff, alpha: 0.1 });
    this.addChild(this.hitZone);

    this._sprite = new Sprite(options.texture);
    this._sprite.scale = 0.3;
    this._sprite.anchor.set(0.5);
    this.addChild(this._sprite);

    this.disabledColorMatrix = new ColorMatrixFilter();
    this.disabledColorMatrix.greyscale(0.1, false);
    this.sprite.filters = this.disabledColorMatrix;

    this.buttonLabel = new Text({
      text: options.text ?? "",
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: "white",
        ...options.textStyle,
      },
    });
    this.buttonLabel.anchor.set(0, 0.5);
    this.buttonLabel.x = 50;
    this.addChild(this.buttonLabel);

    this.eventMode = "static";
    // this.cursor = "pointer";

    this.on("pointerdown", this.handleClick, this);
  }

  private handleClick(): void {
    console.log(this);
    this.onClick?.();
  }

  public setTexture(texture: Texture): void {
    this._sprite.texture = texture;
  }

  public setText(text: string): void {
    this.buttonLabel.text = text;
  }

  public setOnClick(handler: () => void): void {
    this.onClick = handler;
  }
}
