import PlaceableObject from "./PlaceableObject";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import { InteractiveArea } from "./InteractiveArea";
import { LandType } from "../Game/Game";

export default class Fence extends PlaceableObject {
  constructor() {
    super();
    this._landType = LandType.Fence;
  }

  async init() {
    await super.init(ObjectsMeshEnum.Fence);

    const positions = [
      { x: 1.6, z: 2.95, r: 0 },
      { x: -0.2, z: -2.3, r: 0.67 },
      { x: -1.5, z: 2.65, r: -0.23 },
    ];

    for (let i = 0; i < 3; i++) {
      const area = new InteractiveArea();
      this.add(area);
      this.interactiveAreas.push(area);
      area.position.set(positions[i].x, 0, positions[i].z);
      area.rotation.set(0, positions[i].r, 0);
    }
  }
}
