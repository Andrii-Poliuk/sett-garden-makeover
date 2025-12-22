import { Container, Sprite, Text } from "pixi.js";
import { Vector3 } from "three";
import gsap from "gsap";
import Game from "../Game/Game";
import PixiAssetsLoader, { PixiAsset } from "../Game/PixiAssetsLoader";

export default class FloatingText extends Container {
  private static pool: FloatingText[] = [];
  private static activeInstances: FloatingText[] = [];
  private static readonly poolSize = 10;
  private static initialized = false;
  private static parentContainer: Container | null = null;

  private contentContainer: Container;
  private amountText: Text;
  private moneySprite: Sprite;

  protected constructor() {
    super();

    this.contentContainer = new Container();
    this.addChild(this.contentContainer);

    this.amountText = new Text({
      text: "+100",
      style: {
        fontFamily: "Arial",
        fontSize: 42,
        fontWeight: "bold",
        fill: "white",
        stroke: { color: "#A0A0A0", width: 2 },
        align: "right",
      },
    });
    this.amountText.anchor.set(1, 0.5);
    this.contentContainer.addChild(this.amountText);

    const assets = PixiAssetsLoader.instance;
    this.moneySprite = new Sprite(assets.getTexture(PixiAsset.Money));
    this.moneySprite.scale.set(0.25);
    this.moneySprite.anchor.set(0.5);
    this.moneySprite.x = 20;
    this.contentContainer.addChild(this.moneySprite);

    this.visible = false;
  }

  public static init(parentContainer: Container): void {
    if (FloatingText.initialized) return;

    FloatingText.parentContainer = parentContainer;

    for (let i = 0; i < FloatingText.poolSize; i++) {
      const instance = new FloatingText();
      FloatingText.pool.push(instance);
      parentContainer.addChild(instance);
    }

    FloatingText.initialized = true;
  }

  private static getInstance(): FloatingText | null {
    if (!FloatingText.parentContainer) {
      return null;
    }
    if (FloatingText.pool.length == 0) {
      const instance = new FloatingText();
      FloatingText.pool.push(instance);
      FloatingText.parentContainer.addChild(instance);
    }
    const instance = FloatingText.pool.pop()!;
    FloatingText.activeInstances.push(instance);
    return instance;
  }

  private static returnInstance(instance: FloatingText): void {
    const index = FloatingText.activeInstances.indexOf(instance);
    if (index !== -1) {
      FloatingText.activeInstances.splice(index, 1);
    }
    instance.reset();
    FloatingText.pool.push(instance);
  }

  public static playEffect(amount: number, worldPosition: Vector3): void {
    if (!FloatingText.initialized) return;

    const instance = FloatingText.getInstance();
    if (!instance) return;

    const screenPosition = FloatingText.worldToScreen(worldPosition);
    instance.position.set(screenPosition.x, screenPosition.y);

    const prefix = amount >= 0 ? "+" : "";
    instance.amountText.text = `${prefix}${amount}`;
    instance.amountText.style.fill = amount >= 0 ? "#00ff00" : "#ff0000";

    instance.contentContainer.alpha = 1;
    instance.contentContainer.y = 0;
    instance.visible = true;

    const randomDelay = Math.random() * 0.2;
    gsap.to(instance.contentContainer, {
      y: -50,
      alpha: 0,
      duration: 1,
      delay: randomDelay,
      ease: "power2.out",
      onComplete: () => {
        FloatingText.returnInstance(instance);
      },
    });
  }

  private static worldToScreen(worldPosition: Vector3): {
    x: number;
    y: number;
  } {
    const camera = Game.instance.getCamera();
    if (!camera) return { x: 0, y: 0 };

    const vector = worldPosition.clone();
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

    return { x, y };
  }

  private reset(): void {
    this.visible = false;
    this.contentContainer.alpha = 1;
    this.contentContainer.y = 0;
  }
}
