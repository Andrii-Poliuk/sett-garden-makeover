import { Assets, Texture } from "pixi.js";

export enum PixiAsset {
  Corn = "images/corn.png",
  Tomato = "images/tomato.png",
  Grape = "images/grape.png",
  Strawberry = "images/strawberry.png",
  Cow = "images/cow.png",
  Sheep = "images/sheep.png",
  SkipDay = "images/skip_day.png",
  Money = "images/money.png",
  Plus = "images/plus.png",
  PlusButton = "images/plus-button.png",
}

export enum SoundAsset {
  Chicken = "sounds/chicken.mp3",
  Click = "sounds/click_003.mp3",
  Cow = "sounds/cow.mp3",
  PopupChest = "sounds/popup_chest.mp3",
  Sheep = "sounds/sheep.mp3",
  Sheep2 = "sounds/sheep2.mp3",
  Theme = "sounds/theme.mp3",
  ThrowSpear = "sounds/throw_spear.mp3",
}

export default class PixiAssetsLoader {
  private static _instance: PixiAssetsLoader;

  private textures: Map<PixiAsset, Texture> = new Map();
  private sounds: Map<SoundAsset, HTMLAudioElement> = new Map();

  private constructor() {}

  public static get instance(): PixiAssetsLoader {
    if (!PixiAssetsLoader._instance) {
      PixiAssetsLoader._instance = new PixiAssetsLoader();
    }
    return PixiAssetsLoader._instance;
  }

  public async loadAssets(): Promise<void> {
    const assetKeys = Object.values(PixiAsset);

    const loadedTextures = await Promise.all(
      assetKeys.map((path) => Assets.load(path))
    );

    assetKeys.forEach((key, index) => {
      this.textures.set(key, loadedTextures[index]);
    });

    await this.loadSounds();
  }

  private async loadSounds(): Promise<void> {
    const soundKeys = Object.values(SoundAsset);

    await Promise.all(
      soundKeys.map((path) => {
        return new Promise<void>((resolve) => {
          const audio = new Audio(path);
          audio.addEventListener("canplaythrough", () => {
            this.sounds.set(path as SoundAsset, audio);
            resolve();
          }, { once: true });
          audio.addEventListener("error", () => {
            console.warn(`Failed to load sound: ${path}`);
            resolve();
          }, { once: true });
          audio.load();
        });
      })
    );
  }

  public getTexture(asset: PixiAsset): Texture {
    const texture = this.textures.get(asset);
    if (!texture) {
      throw new Error(`Texture not found: ${asset}`);
    }
    return texture;
  }

  public getSound(asset: SoundAsset): HTMLAudioElement | undefined {
    return this.sounds.get(asset);
  }

  public playSound(asset: SoundAsset, volume: number = 1): void {
    const audio = new Audio(asset);
    audio.volume = volume;
    audio.play();
  }
}
