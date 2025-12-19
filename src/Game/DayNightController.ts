import { AmbientLight } from "three";
import gsap from "gsap";
import GameScene from "./GameScene";

export enum TimeOfDay {
  Morning,
  Day,
  Evening,
  Night,
}

export default class DayNightController {
  private gameScene: GameScene;
  private currentTween: gsap.core.Tween | null = null;
  private currentLightColor: { r: number; g: number; b: number; i: number } = { r: 1, g: 1, b: 1, i: 1.5 };
  private currentSkyColor: { r: number; g: number; b: number } = { r: 0.3, g: 0.5, b: 1 };

  private readonly lightColors: Record<TimeOfDay, { r: number; g: number; b: number; i: number }> = {
    [TimeOfDay.Morning]: { r: 1.0, g: 0.9, b: 0.8, i: 1 },
    [TimeOfDay.Day]: { r: 1.0, g: 1.0, b: 1.0, i: 1.5 },
    [TimeOfDay.Evening]: { r: 1.0, g: 0.7, b: 0.5, i: 0.7 },
    [TimeOfDay.Night]: { r: 0.3, g: 0.3, b: 0.6, i: 0.1 },
  };

  private readonly skyColors: Record<TimeOfDay, { r: number; g: number; b: number }> = {
    [TimeOfDay.Morning]: { r: 0.6, g: 0.7, b: 0.9 },
    [TimeOfDay.Day]: { r: 0.3, g: 0.5, b: 1.0 },
    [TimeOfDay.Evening]: { r: 0.8, g: 0.4, b: 0.3 },
    [TimeOfDay.Night]: { r: 0.05, g: 0.05, b: 0.15 },
  };

  private readonly transitionDuration: number = 1.5;

  constructor(gameScene: GameScene) {
    this.gameScene = gameScene;
  }

  public get ambientLight(): AmbientLight | undefined {
    return this.gameScene.ambientLight;
  }

  private killCurrentTween(): void {
    if (this.currentTween) {
      this.currentTween.kill();
      this.currentTween = null;
    }
  }

  private async transitionTo(timeOfDay: TimeOfDay): Promise<void> {
    this.killCurrentTween();

    const targetLightColor = this.lightColors[timeOfDay];
    const targetSkyColor = this.skyColors[timeOfDay];

    return new Promise((resolve) => {
      this.currentTween = gsap.to(this.currentLightColor, {
        r: targetLightColor.r,
        g: targetLightColor.g,
        b: targetLightColor.b,
        i: targetLightColor.i,
        duration: this.transitionDuration,
        onUpdate: () => {
          this.applyColors();
        },
        onComplete: () => {
          this.currentTween = null;
          resolve();
        },
      });

      gsap.to(this.currentSkyColor, {
        r: targetSkyColor.r,
        g: targetSkyColor.g,
        b: targetSkyColor.b,
        duration: this.transitionDuration,
      });
    });
  }

  private applyColors(): void {
    this.gameScene.setEnvironmentColors(
      this.currentLightColor.r,
      this.currentLightColor.g,
      this.currentLightColor.b,
      this.currentLightColor.i,
      this.currentSkyColor.r,
      this.currentSkyColor.g,
      this.currentSkyColor.b
    );
  }

  public async setMorning(): Promise<void> {
    return this.transitionTo(TimeOfDay.Morning);
  }

  public async setDay(): Promise<void> {
    return this.transitionTo(TimeOfDay.Day);
  }

  public async setEvening(): Promise<void> {
    return this.transitionTo(TimeOfDay.Evening);
  }

  public async setNight(): Promise<void> {
    return this.transitionTo(TimeOfDay.Night);
  }
}
