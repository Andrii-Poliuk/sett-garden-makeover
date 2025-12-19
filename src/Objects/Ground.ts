import PlaceableObject from "./PlaceableObject";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import { InteractiveArea } from "./InteractiveArea";
import { LandType } from "../Game/Game";

export default class Ground extends PlaceableObject {
  constructor() {
    super();
    this._landType = LandType.Ground;
    for (let i = 0; i < 6; i++) {
      this.interactiveAreas.push(new InteractiveArea());
    }
  }

  async init() {
    await super.init(ObjectsMeshEnum.Ground);

    const positions = [
      { x: -1.7, z: -3.25 },
      { x: -1.7, z: 0 },
      { x: -1.7, z: 3.5 },
      { x: 1.7, z: -3.25 },
      { x: 1.7, z: 0 },
      { x: 1.7, z: 3.5 },
    ];

    this.interactiveAreas.forEach((area, index) => {
      area.position.set(positions[index].x, 0, positions[index].z);
      this.add(area);
    });
  }
}
