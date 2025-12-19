import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Sprite,
  Text,
  Texture,
  ColorMatrixFilter,
} from "pixi.js";

export interface SpriteButtonOptions {
  texture: Texture;
  text?: string;
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
  private originalScale: number = 1;
  private pressedScale: number = 1.03;

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
    this.hitZone.rect(-40, -35, 220, 70);
    this.hitZone.fill({ color: 0xffffff, alpha: 1 });
    this.hitZone.alpha = 0;
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
        stroke: { color: "#303030", width: 1 },
      },
    });
    this.buttonLabel.anchor.set(0, 0.5);
    this.buttonLabel.x = 50;
    this.addChild(this.buttonLabel);

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
  }

  private handlePointerUp(event: FederatedPointerEvent): void {
    if (!this.isValidPointer(event)) return;
    this.scale.set(this.originalScale);
    this.onClick?.();
  }

  private handleHover(): void {
    this.hitZone.alpha = 0.1;
  }

  private handleHoverEnd(): void {
    this.hitZone.alpha = 0;
    this.scale.set(this.originalScale);
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
