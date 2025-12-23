import {
  Bounds,
  Container,
  FederatedPointerEvent,
  Graphics,
  Sprite,
  Text,
  ColorMatrixFilter,
  Rectangle,
} from "pixi.js";
import PixiAssetsLoader, { PixiAsset, SoundAsset } from "../Game/PixiAssetsLoader";

export interface SpriteButtonOptions {
  texture: PixiAsset;
  text?: string;
  onClick?: () => void;
}

export default class SpriteButton extends Container {
  private spriteEnabled: Sprite;
  private spriteDisabled: Sprite;
  private buttonLabel: Text;

  public get spriteScale(): { x: number; y: number } {
    return { x: this.spriteEnabled.scale.x, y: this.spriteEnabled.scale.y };
  }

  public set spriteScale(value: { x: number; y: number }) {
    this.spriteEnabled.scale.set(value.x, value.y);
    this.spriteDisabled.scale.set(value.x, value.y);
  }

  public getSpriteRect(): Rectangle {
    const sprite = this.spriteEnabled;
    return new Rectangle(sprite.x, sprite.y, sprite.width, sprite.height);
  }

  private hitZone: Graphics;
  private onClick: (() => void) | undefined;
  private originalScale: number = 1;
  private pressedScale: number = 1.03;

  public setEnabled(enabled: boolean): void {
    this.interactive = enabled;
    if (enabled) {
      this.spriteDisabled.visible = true;
      this.spriteDisabled.visible = false;
    } else {
      this.spriteDisabled.visible = false;
      this.spriteDisabled.visible = true;
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

    const enabledTexture = PixiAssetsLoader.instance.getTexture(options.texture);
    this.spriteEnabled = new Sprite(enabledTexture);
    this.spriteEnabled.scale = 0.3;
    this.spriteEnabled.anchor.set(0.5);
    this.addChild(this.spriteEnabled);

    const disabledTexture = PixiAssetsLoader.instance.getTextureFilter(options.texture);
    this.spriteDisabled = new Sprite(disabledTexture);
    this.spriteDisabled.scale = 0.3;
    this.spriteDisabled.anchor.set(0.5);
    this.addChild(this.spriteDisabled);

    const disabledColorMatrix = new ColorMatrixFilter();
    disabledColorMatrix.greyscale(0.1, false);
    this.spriteDisabled.filters = [disabledColorMatrix];

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

    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
  }

  private handlePointerUp(event: FederatedPointerEvent): void {
    if (!this.isValidPointer(event)) return;
    this.scale.set(this.originalScale);
    PixiAssetsLoader.instance.playSound(SoundAsset.Click);
    this.onClick?.();
  }

  private handleHover(): void {
    this.hitZone.alpha = 0.1;
  }

  private handleHoverEnd(): void {
    this.hitZone.alpha = 0;
    this.scale.set(this.originalScale);
  }

  public setText(text: string): void {
    this.buttonLabel.text = text;
  }

  public setOnClick(handler: () => void): void {
    this.onClick = handler;
  }
}
