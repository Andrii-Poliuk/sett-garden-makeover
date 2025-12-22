import * as THREE from "three";
import {
  ParticleSystem,
  IntervalValue,
  ConstantValue,
  ColorRange,
  RenderMode,
  SizeOverLife,
  RotationOverLife,
  ApplyForce,
  PiecewiseBezier,
  Bezier,
  SphereEmitter,
  Vector3,
  Vector4,
} from "three.quarks";
import Game from "../Game/Game";

// Shared material cache to prevent VFXBatch duplication
const sharedMaterials: Map<string, THREE.MeshBasicMaterial> = new Map();

// Particle texture paths to preload
const ParticleTextures = ["./images/leaf.png", "./images/smoke.png"];

export class SpriteParticleEffect extends THREE.Object3D {
private particleSystem?: ParticleSystem;
  private colorRange?: ColorRange;

  constructor() {
    super();
  }

  public static async preloadMaterials(): Promise<void> {
    const loader = new THREE.TextureLoader();
    await Promise.all(
      ParticleTextures.map(async (path) => {
        const texture = await loader.loadAsync(path);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
        });
        sharedMaterials.set(path, material);
      }),
    );
  }

  private getOrCreateMaterial(
    image: string,
    texture: THREE.Texture,
  ): THREE.MeshBasicMaterial {
    let material = sharedMaterials.get(image);
    if (!material) {
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
      sharedMaterials.set(image, material);
    }

    return material;
  }

  public async init(
    image: string,
    colorRange: {
      color1: { r: number; g: number; b: number };
      color2: { r: number; g: number; b: number };
    },
  ) {
    this.colorRange = new ColorRange(
      new Vector4(
        colorRange.color1.r,
        colorRange.color1.g,
        colorRange.color1.b,
        1,
      ),
      new Vector4(
        colorRange.color2.r,
        colorRange.color2.g,
        colorRange.color2.b,
        1,
      ),
    );
    const texture = await new THREE.TextureLoader().loadAsync(image);
    const material = this.getOrCreateMaterial(image, texture);
    this.particleSystem = this.createParticleSystem(material);
    this.add(this.particleSystem.emitter);
    Game.instance.getBatchRenderer().addSystem(this.particleSystem);
  }

  protected createParticleSystem(
    material: THREE.MeshBasicMaterial,
  ): ParticleSystem {
    const system = new ParticleSystem({
      duration: 0.5,
      looping: false,
      startLife: new IntervalValue(1, 2),
      startSpeed: new IntervalValue(2.5, 3.5),
      startSize: new IntervalValue(1, 1.5),
      startRotation: new IntervalValue(0, Math.PI * 2),
      startColor: this.colorRange,
      worldSpace: false,
      emissionOverTime: new ConstantValue(0),
      emissionBursts: [
        {
          time: 0.1,
          count: new ConstantValue(20),
          cycle: 2,
          interval: 0.1,
          probability: 1,
        },
      ],
      shape: new SphereEmitter({
        radius: 0.5,
        thickness: 1,
      }),
      material: material,
      renderMode: RenderMode.BillBoard,
      rendererEmitterSettings: {
        startTileIndex: new ConstantValue(0),
        uTileCount: 1,
        vTileCount: 1,
      },
    });

    system.addBehavior(
      new ApplyForce(new Vector3(0, -6, 0), new ConstantValue(1)),
    );

    system.addBehavior(
      new RotationOverLife(new IntervalValue(-Math.PI, Math.PI)),
    );

    system.addBehavior(
      new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.8, 0.3, 0), 0]])),
    );

    return system;
  }

  public setPosition(position: THREE.Vector3): void {
    if (this.particleSystem) {
      this.particleSystem.emitter.position.copy(position);
    }
  }

  public stop(): void {
    if (this.particleSystem) {
      this.particleSystem.pause();
    }
  }

  public start(): void {
    if (this.particleSystem) {
      this.particleSystem.play();
    }
  }

  public restart(): void {
    if (this.particleSystem) {
      this.particleSystem.restart();
    }
  }

  public destroy(): void {
    if (this.particleSystem) {
      this.particleSystem.pause();
      this.remove(this.particleSystem.emitter);
      Game.instance.getBatchRenderer().deleteSystem(this.particleSystem);
      this.particleSystem.dispose();
      this.particleSystem = undefined;
    }
  }
}
