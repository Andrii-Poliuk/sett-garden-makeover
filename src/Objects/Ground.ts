import PlaceableObject from "./PlaceableObject";
import { ObjectsMeshEnum } from "./ObjectsMeshEnum";
import { InteractiveArea } from "./InteractiveArea";
import { AxesHelper } from "three";

export default class Ground extends PlaceableObject {
  constructor() {
    super();
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

    this.add(new AxesHelper(1));
  }
}
