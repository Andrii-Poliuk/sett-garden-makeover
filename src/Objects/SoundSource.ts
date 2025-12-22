import { Object3D } from "three";
import PixiAssetsLoader, { SoundAsset } from "../Game/PixiAssetsLoader";

export interface SoundSourceOptions {
  sound: SoundAsset;
  minInterval: number;
  maxInterval: number;
  volume?: number;
}

export default class SoundSource extends Object3D {
  private sound?: HTMLAudioElement;
  private minIntervalValue: number;
  private maxIntervalValue: number;
  private timeUntilNextSound: number = 0;
  private isPlaying: boolean = false;

  public get minInterval(): number {
    return this.minIntervalValue;
  }

  public set minInterval(value: number) {
    this.minIntervalValue = value;
  }

  public get maxInterval(): number {
    return this.maxIntervalValue;
  }

  public set maxInterval(value: number) {
    this.maxIntervalValue = value;
  }

  constructor(options: SoundSourceOptions) {
    super();

    this.minIntervalValue = options.minInterval;
    this.maxIntervalValue = options.maxInterval;

    this.sound = PixiAssetsLoader.instance.createSound(options.sound);
    if (this.sound) {
      this.sound.volume = options.volume ?? 0.4;
    }

    this.scheduleNextSound();
  }

  private scheduleNextSound(): void {
    const range = this.maxIntervalValue - this.minIntervalValue;
    this.timeUntilNextSound = this.minIntervalValue + Math.random() * range;
  }

  public start(): void {
    this.isPlaying = true;
    this.scheduleNextSound();
  }

  public stop(): void {
    this.isPlaying = false;
  }

  public update(delta: number): void {
    if (!this.isPlaying) return;

    this.timeUntilNextSound -= delta;
    if (this.timeUntilNextSound <= 0) {
      this.sound?.play();
      this.scheduleNextSound();
    }
  }

  public destroy(): void {
    this.stop();
    if (this.sound) {
      this.sound.pause();
      this.sound.src = "";
      this.sound = undefined;
    }
    this.removeFromParent();
  }
}
