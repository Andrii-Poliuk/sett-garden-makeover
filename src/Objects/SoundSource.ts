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
  private _minInterval: number;
  private _maxInterval: number;
  private timeUntilNextSound: number = 0;
  private isPlaying: boolean = false;

  public get minInterval(): number {
    return this._minInterval;
  }

  public set minInterval(value: number) {
    this._minInterval = value;
  }

  public get maxInterval(): number {
    return this._maxInterval;
  }

  public set maxInterval(value: number) {
    this._maxInterval = value;
  }

  constructor(options: SoundSourceOptions) {
    super();

    this._minInterval = options.minInterval;
    this._maxInterval = options.maxInterval;

    this.sound = PixiAssetsLoader.instance.createSound(options.sound);
    if (this.sound) {
      this.sound.volume = options.volume ?? 0.4;
    }

    this.scheduleNextSound();
  }

  private scheduleNextSound(): void {
    const range = this._maxInterval - this._minInterval;
    this.timeUntilNextSound = this._minInterval + Math.random() * range;
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
