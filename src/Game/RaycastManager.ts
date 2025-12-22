import { Camera, Raycaster, Vector2, WebGLRenderer } from "three";
import { InteractiveArea } from "../Objects/InteractiveArea";
import { Container, EventBoundary, Point } from "pixi.js";

export class RaycastManager {
  private static _instance: RaycastManager | null = null;
  private interactiveAreas: InteractiveArea[] = [];

  private raycaster = new Raycaster();
  // private renderer?: WebGLRenderer;
  // private camera?: Camera;

  public enabled: boolean = true;

  private uiStage?: Container;
  private eventBoundary?: EventBoundary;

  public setUIStage(stage: Container): void {
    this.uiStage = stage;
    this.eventBoundary = new EventBoundary(stage);
  }

  private isOverUI(x: number, y: number): boolean {
    if (!this.eventBoundary || !this.uiStage) return false;

    const point = new Point(x, y);
    const hit = this.eventBoundary.hitTest(point.x, point.y);

    return hit !== null && hit !== this.uiStage;
  }

  public init(renderer: WebGLRenderer, camera: Camera): void {
    // this.renderer = renderer;
    // this.camera = camera;

    renderer.domElement.addEventListener("mousemove", (e) => {
      if (!this.enabled) return;

      const mouse: Vector2 = new Vector2();
      mouse.set(
        (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
      );

      this.raycaster.setFromCamera(mouse, camera);

      const intersects = this.raycaster.intersectObjects(
        this.interactiveAreas,
        false,
      );

      this.interactiveAreas.forEach((p) => (p.hovered = false));

      intersects.length &&
        ((intersects[0].object as InteractiveArea).hovered = true);
    });

    renderer.domElement.addEventListener("pointerdown", (e) => {
      if (!this.enabled) return;

      // Check if click is over UI element
      if (this.isOverUI(e.clientX, e.clientY)) return;

      const mouse: Vector2 = new Vector2();
      mouse.set(
        (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(e.clientY / renderer.domElement.clientHeight) * 2 + 1,
      );

      this.raycaster.setFromCamera(mouse, camera);

      const intersects = this.raycaster.intersectObjects(
        this.interactiveAreas,
        false,
      );

      if (intersects.length) {
        const area = intersects[0].object as InteractiveArea;
        area.onPress?.(area);
      }
    });
  }

  private constructor() {}

  public addInteractiveArea(area: InteractiveArea): void {
    this.interactiveAreas.push(area);
  }

  public removeInteractiveArea(area: InteractiveArea): void {
    const index = this.interactiveAreas.indexOf(area);
    if (index !== -1) {
      this.interactiveAreas.splice(index, 1);
    }
  }

  public static get instance(): RaycastManager {
    if (!RaycastManager._instance) {
      RaycastManager._instance = new RaycastManager();
    }
    return RaycastManager._instance;
  }
}
