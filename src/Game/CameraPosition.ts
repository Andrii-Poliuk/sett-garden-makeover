import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { lerp } from "../Helpers";

export interface CameraPositionData {
  position: Vector3;
  target: Vector3;
}

export default class CameraPosition extends Object3D {
  public cameraTarget: Object3D;
  public lerpSpeed: number = 0.05;
  private camera?: PerspectiveCamera;
  private currentLookAt: Vector3 = new Vector3();

  private targetVector: Vector3 = new Vector3();

  constructor() {
    super();

    // const axesHelper = new AxesHelper(1);
    // this.add(axesHelper);

    this.cameraTarget = new Object3D();
    this.add(this.cameraTarget);

    // const targetAxesHelper = new AxesHelper(1);
    // this.cameraTarget.add(targetAxesHelper);
  }

  public update(): void {
    if (!this.camera) return;

    this.camera.position.x = lerp(
      this.camera.position.x,
      this.position.x,
      this.lerpSpeed,
    );
    this.camera.position.y = lerp(
      this.camera.position.y,
      this.position.y,
      this.lerpSpeed,
    );
    this.camera.position.z = lerp(
      this.camera.position.z,
      this.position.z,
      this.lerpSpeed,
    );

    const targetWorldPosition = this.cameraTarget.getWorldPosition(
      this.targetVector,
    );
    this.currentLookAt.x = lerp(
      this.currentLookAt.x,
      targetWorldPosition.x,
      this.lerpSpeed,
    );
    this.currentLookAt.y = lerp(
      this.currentLookAt.y,
      targetWorldPosition.y,
      this.lerpSpeed,
    );
    this.currentLookAt.z = lerp(
      this.currentLookAt.z,
      targetWorldPosition.z,
      this.lerpSpeed,
    );
    this.camera.lookAt(this.currentLookAt);
  }

  public snapCamera(camera: PerspectiveCamera): void {
    this.camera = camera;
  }

  public updatePosition(data: CameraPositionData): void {
    this.position.copy(data.position);
    this.cameraTarget.position.copy(data.target);
  }
}
