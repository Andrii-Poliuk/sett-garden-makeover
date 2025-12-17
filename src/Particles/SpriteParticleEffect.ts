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

export class SpriteParticleEffect extends THREE.Object3D {
  private particleSystem?: ParticleSystem;
  private texture?: THREE.Texture;
  private colorRange?: ColorRange;

  constructor() {
    super();
  }

  public async init(image: string, colorRange: {
    color1:{r: number, g: number ,b: number}
    color2:{r: number, g: number ,b: number}
  }) {
    this.colorRange = new ColorRange(
      new Vector4(colorRange.color1.r, colorRange.color1.g, colorRange.color1.b, 1),
      new Vector4(colorRange.color2.r, colorRange.color2.g, colorRange.color2.b, 1),
    );
    this.texture = await new THREE.TextureLoader().loadAsync(image);
    this.particleSystem = this.createParticleSystem();
    this.add(this.particleSystem.emitter);
    Game.instance.getBatchRenderer().addSystem(this.particleSystem);
  } 

  protected createParticleSystem(): ParticleSystem {
    const system = new ParticleSystem({
      duration: 0.5,
      looping: false,
      startLife: new IntervalValue(1, 2),
      startSpeed: new IntervalValue(2, 3),
      startSize: new IntervalValue(1, 1.5),
      startRotation: new IntervalValue(0, Math.PI * 2),
      startColor: this.colorRange,
      // new ColorRange(
      //   new Vector4(0.1, 0.6, 0.1, 1),
      //   new Vector4(0.2, 0.7, 0.2, 1)
      // ),
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
      material: new THREE.MeshBasicMaterial({
        map: this.texture,
        transparent: true,
      }),
      renderMode: RenderMode.BillBoard,
      rendererEmitterSettings: {
        startTileIndex: new ConstantValue(0),
        uTileCount: 1,
        vTileCount: 1,
      },
    });

    // Add slight gravity
    system.addBehavior(
      new ApplyForce(new Vector3(0, -6, 0), new ConstantValue(1))
    );

    // Add rotation over lifetime
    system.addBehavior(
      new RotationOverLife(new IntervalValue(-Math.PI, Math.PI))
    );

    // Scale down and fade out over lifetime
    system.addBehavior(
      new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.8, 0.3, 0), 0]]))
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

  public dispose(): void {
    if (this.particleSystem) {
      Game.instance.getBatchRenderer().deleteSystem(this.particleSystem);
      this.particleSystem.dispose();
    }
  }
}
