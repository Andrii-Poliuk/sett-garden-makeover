import { Container } from "pixi.js";
import gsap from "gsap";

export default class MenuBase extends Container {
  private slideOffset: number = 30;
  private currentTween: gsap.core.Tween | null = null;
  private originalX: number = 0;
  private originalY: number = 0;
  private flexibleScale: number = 0;

  public show(): void {
    if (this.visible && !this.currentTween) return;
    this.killCurrentTween();
    this.visible = true;
    this.alpha = 0;
    this.x = this.originalX * this.flexibleScale - this.slideOffset;
    this.currentTween = gsap.to(this, {
      alpha: 1,
      x: this.originalX * this.flexibleScale,
      duration: 0.2,
      delay: 0.1,
      onComplete: () => {
        this.currentTween = null;
      },
    });
  }

  public hide(): void {
    if (!this.visible && !this.currentTween) return;
    this.killCurrentTween();
    this.currentTween = gsap.to(this, {
      alpha: 0,
      x: this.originalX * this.flexibleScale - this.slideOffset,
      duration: 0.2,
      onComplete: () => {
        this.visible = false;
        this.x = this.originalX * this.flexibleScale;
        this.currentTween = null;
      },
    });
  }

  private killCurrentTween(): void {
    if (this.currentTween) {
      this.currentTween.kill();
      this.currentTween = null;
      this.x = this.originalX * this.flexibleScale;
      this.alpha = 1;
    }
  }

  public setOriginalPosition(x: number, y?: number): void {
    this.originalX = x;
    if (y !== undefined) {
      this.originalY = y;
    }
  }

  public resize(flexibleScale: number): void {
    this.flexibleScale = flexibleScale;
    this.scale.set(flexibleScale);
    this.position.set(
      this.originalX * flexibleScale,
      this.originalY * flexibleScale,
    );
  }
}
