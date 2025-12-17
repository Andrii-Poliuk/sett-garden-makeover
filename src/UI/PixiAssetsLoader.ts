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

export default class PixiAssetsLoader {
  private static _instance: PixiAssetsLoader;

  private textures: Map<PixiAsset, Texture> = new Map();

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
  }

  public getTexture(asset: PixiAsset): Texture {
    const texture = this.textures.get(asset);
    if (!texture) {
      throw new Error(`Texture not found: ${asset}`);
    }
    return texture;
  }
}
