import {
  AmbientLight,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import MultiStageObject from "./Objects/MultiStageObject";
import CameraPosition from "./Game/CameraPosition";
import DayNightController from "./Game/DayNightController";

export namespace Helpers {
  export function setupMultiStageGUI(
    obj: MultiStageObject,
    name: string = "Stages",
  ): GUI {
    const gui = new GUI({ title: name });

    const actions = {
      setStage1: () => obj.setStage1(),
      setStage2: () => obj.setStage2(),
      setStage3: () => obj.setStage3(),
    };

    gui.add(actions, "setStage1").name("Stage 1");
    gui.add(actions, "setStage2").name("Stage 2");
    gui.add(actions, "setStage3").name("Stage 3");

    return gui;
  }

  export function setupObjectGUI(
    obj: Object3D,
    name: string = "Object",
    parentGui?: GUI,
  ): GUI {
    const gui = parentGui ?? new GUI({ title: name });
    const folder = parentGui ? gui.addFolder(name) : gui;

    const posFolder = folder.addFolder("Position");
    posFolder.add(obj.position, "x", -10, 10, 0.05).name("X");
    posFolder.add(obj.position, "y", -10, 10, 0.05).name("Y");
    posFolder.add(obj.position, "z", -10, 10, 0.05).name("Z");

    const posDisplay = {
      get value() {
        return `(${obj.position.x.toFixed(2)}, ${obj.position.y.toFixed(2)}, ${obj.position.z.toFixed(2)})`;
      },
    };
    posFolder.add(posDisplay, "value").name("Display").listen().disable();

    const rotFolder = folder.addFolder("Rotation");
    rotFolder.add(obj.rotation, "x", -Math.PI, Math.PI, 0.01).name("X");
    rotFolder.add(obj.rotation, "y", -Math.PI, Math.PI, 0.01).name("Y");
    rotFolder.add(obj.rotation, "z", -Math.PI, Math.PI, 0.01).name("Z");

    const rotDisplay = {
      get value() {
        return `(${obj.rotation.x.toFixed(2)}, ${obj.rotation.y.toFixed(2)}, ${obj.rotation.z.toFixed(2)})`;
      },
    };
    rotFolder.add(rotDisplay, "value").name("Display").listen().disable();

    return gui;
  }

  export function setupCameraPositionGUI(
    cameraPos: CameraPosition,
    name: string = "Camera Position",
  ): GUI {
    const gui = new GUI({ title: name });

    const posFolder = gui.addFolder("Position");
    posFolder.add(cameraPos.position, "x", -30, 30, 0.1).name("X");
    posFolder.add(cameraPos.position, "y", -30, 30, 0.1).name("Y");
    posFolder.add(cameraPos.position, "z", -30, 30, 0.1).name("Z");

    const posDisplay = {
      get value() {
        return `(${cameraPos.position.x.toFixed(2)}, ${cameraPos.position.y.toFixed(2)}, ${cameraPos.position.z.toFixed(2)})`;
      },
    };
    posFolder.add(posDisplay, "value").name("Display").listen().disable();

    const targetFolder = gui.addFolder("Target Position");
    targetFolder
      .add(cameraPos.cameraTarget.position, "x", -20, 20, 0.1)
      .name("X");
    targetFolder
      .add(cameraPos.cameraTarget.position, "y", -20, 20, 0.1)
      .name("Y");
    targetFolder
      .add(cameraPos.cameraTarget.position, "z", -20, 20, 0.1)
      .name("Z");

    const targetPosDisplay = {
      get value() {
        return `(${cameraPos.cameraTarget.position.x.toFixed(2)}, ${cameraPos.cameraTarget.position.y.toFixed(2)}, ${cameraPos.cameraTarget.position.z.toFixed(2)})`;
      },
    };
    targetFolder
      .add(targetPosDisplay, "value")
      .name("Display")
      .listen()
      .disable();

    return gui;
  }

  export function setupDirectionalLightGUI(
    light: DirectionalLight,
    ambientLight?: AmbientLight,
    name: string = "Light",
  ): GUI {
    const gui = new GUI({ title: name });

    const dirFolder = gui.addFolder("Directional Light");

    const posFolder = dirFolder.addFolder("Position");
    posFolder.add(light.position, "x", -50, 50, 0.5).name("X");
    posFolder.add(light.position, "y", -50, 50, 0.5).name("Y");
    posFolder.add(light.position, "z", -50, 50, 0.5).name("Z");

    const posDisplay = {
      get value() {
        return `(${light.position.x.toFixed(2)}, ${light.position.y.toFixed(2)}, ${light.position.z.toFixed(2)})`;
      },
    };
    posFolder.add(posDisplay, "value").name("Display").listen().disable();

    const dirColorParams = {
      color: `#${light.color.getHexString()}`,
    };
    dirFolder
      .addColor(dirColorParams, "color")
      .name("Color")
      .onChange((value: string) => {
        light.color.set(value);
      });

    dirFolder.add(light, "intensity", 0, 5, 0.1).name("Intensity");

    if (ambientLight) {
      const ambFolder = gui.addFolder("Ambient Light");

      const ambColorParams = {
        color: `#${ambientLight.color.getHexString()}`,
      };
      ambFolder
        .addColor(ambColorParams, "color")
        .name("Color")
        .onChange((value: string) => {
          ambientLight.color.set(value);
        });

      ambFolder.add(ambientLight, "intensity", 0, 5, 0.1).name("Intensity");
    }

    return gui;
  }

  export function setupDayNightGUI(
    controller: DayNightController,
    name: string = "Day/Night",
  ): GUI {
    const gui = new GUI({ title: name });

    const actions = {
      setMorning: () => controller.setMorning(),
      setDay: () => controller.setDay(),
      setEvening: () => controller.setEvening(),
      setNight: () => controller.setNight(),
    };

    gui.add(actions, "setMorning").name("Morning");
    gui.add(actions, "setDay").name("Day");
    gui.add(actions, "setEvening").name("Evening");
    gui.add(actions, "setNight").name("Night");

    return gui;
  }

  export function setupCameraGUI(
    camera: PerspectiveCamera,
    name: string = "Camera",
  ): GUI {
    const gui = new GUI({ title: name });

    const fovFolder = gui.addFolder("Field of View");
    fovFolder
      .add(camera, "fov", 30, 120, 1)
      .name("FOV")
      .onChange(() => camera.updateProjectionMatrix());

    const fovDisplay = {
      get value() {
        return `${camera.fov.toFixed(1)}°`;
      },
    };
    fovFolder.add(fovDisplay, "value").name("Display").listen().disable();

    const frustumFolder = gui.addFolder("Frustum Culling");
    frustumFolder
      .add(camera, "near", 0.01, 10, 0.01)
      .name("Near Plane")
      .onChange(() => camera.updateProjectionMatrix());
    frustumFolder
      .add(camera, "far", 0.1, 200, 0.1)
      .name("Far Plane")
      .onChange(() => camera.updateProjectionMatrix());

    const frustumDisplay = {
      get value() {
        return `Near: ${camera.near.toFixed(2)}, Far: ${camera.far.toFixed(0)}`;
      },
    };
    frustumFolder
      .add(frustumDisplay, "value")
      .name("Display")
      .listen()
      .disable();

    const aspectDisplay = {
      get value() {
        return `${camera.aspect.toFixed(3)}`;
      },
    };
    gui.add(aspectDisplay, "value").name("Aspect Ratio").listen().disable();

    const dimensionsDisplay = {
      get value() {
        return `${window.innerWidth} x ${window.innerHeight} | ${Math.round((100 * window.innerWidth) / window.innerHeight) / 100}`;
      },
    };
    gui
      .add(dimensionsDisplay, "value")
      .name("Width x Height")
      .listen()
      .disable();

    return gui;
  }
}

export function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to;
  return Math.abs(from - to) < 0.001 ? to : amount;
}

export function setupOrbitControls(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  return controls;
}
