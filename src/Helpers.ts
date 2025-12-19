import { Object3D, PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import MultiStageObject from "./Objects/MultiStageObject";
import CameraPosition from "./Game/CameraPosition";
import DayNightController from "./Game/DayNightController";

export namespace Helpers {
  export function setupMultiStageGUI(obj: MultiStageObject, name: string = "Stages"): GUI {
    const gui = new GUI({ title: name });

    const actions = {
      setStage1: () => obj.setStage1(),
      setStage2: () => obj.setStage2(),
      setStage3: () => obj.setStage3(),
    };

    gui.add(actions, 'setStage1').name('Stage 1');
    gui.add(actions, 'setStage2').name('Stage 2');
    gui.add(actions, 'setStage3').name('Stage 3');

    return gui;
  }

  export function setupObjectGUI(obj: Object3D, name: string = "Object", parentGui?: GUI): GUI {
    const gui = parentGui ?? new GUI({ title: name });
    const folder = parentGui ? gui.addFolder(name) : gui;

    const posFolder = folder.addFolder('Position');
    posFolder.add(obj.position, 'x', -10, 10, 0.05).name('X');
    posFolder.add(obj.position, 'y', -10, 10, 0.05).name('Y');
    posFolder.add(obj.position, 'z', -10, 10, 0.05).name('Z');

    const posDisplay = {
      get value() {
        return `(${obj.position.x.toFixed(2)}, ${obj.position.y.toFixed(2)}, ${obj.position.z.toFixed(2)})`;
      }
    };
    posFolder.add(posDisplay, 'value').name('Display').listen().disable();

    const rotFolder = folder.addFolder('Rotation');
    rotFolder.add(obj.rotation, 'x', -Math.PI, Math.PI, 0.01).name('X');
    rotFolder.add(obj.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Y');
    rotFolder.add(obj.rotation, 'z', -Math.PI, Math.PI, 0.01).name('Z');

    const rotDisplay = {
      get value() {
        return `(${obj.rotation.x.toFixed(2)}, ${obj.rotation.y.toFixed(2)}, ${obj.rotation.z.toFixed(2)})`;
      }
    };
    rotFolder.add(rotDisplay, 'value').name('Display').listen().disable();

    return gui;
  }

  export function setupCameraPositionGUI(cameraPos: CameraPosition, name: string = "Camera Position"): GUI {
    const gui = new GUI({ title: name });

    const posFolder = gui.addFolder('Position');
    posFolder.add(cameraPos.position, 'x', -30, 30, 0.1).name('X');
    posFolder.add(cameraPos.position, 'y', -30, 30, 0.1).name('Y');
    posFolder.add(cameraPos.position, 'z', -30, 30, 0.1).name('Z');

    const posDisplay = {
      get value() {
        return `(${cameraPos.position.x.toFixed(2)}, ${cameraPos.position.y.toFixed(2)}, ${cameraPos.position.z.toFixed(2)})`;
      }
    };
    posFolder.add(posDisplay, 'value').name('Display').listen().disable();

    // const rotFolder = gui.addFolder('Rotation');
    // rotFolder.add(cameraPos.rotation, 'x', -Math.PI, Math.PI, 0.01).name('X');
    // rotFolder.add(cameraPos.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Y');
    // rotFolder.add(cameraPos.rotation, 'z', -Math.PI, Math.PI, 0.01).name('Z');

    // const rotDisplay = {
    //   get value() {
    //     return `(${cameraPos.rotation.x.toFixed(2)}, ${cameraPos.rotation.y.toFixed(2)}, ${cameraPos.rotation.z.toFixed(2)})`;
    //   }
    // };
    // rotFolder.add(rotDisplay, 'value').name('Display').listen().disable();

    const targetFolder = gui.addFolder('Target Position');
    targetFolder.add(cameraPos.cameraTarget.position, 'x', -20, 20, 0.1).name('X');
    targetFolder.add(cameraPos.cameraTarget.position, 'y', -20, 20, 0.1).name('Y');
    targetFolder.add(cameraPos.cameraTarget.position, 'z', -20, 20, 0.1).name('Z');

    const targetPosDisplay = {
      get value() {
        return `(${cameraPos.cameraTarget.position.x.toFixed(2)}, ${cameraPos.cameraTarget.position.y.toFixed(2)}, ${cameraPos.cameraTarget.position.z.toFixed(2)})`;
      }
    };
    targetFolder.add(targetPosDisplay, 'value').name('Display').listen().disable();

    // const targetRotFolder = gui.addFolder('Target Rotation');
    // targetRotFolder.add(cameraPos.cameraTarget.rotation, 'x', -Math.PI, Math.PI, 0.01).name('X');
    // targetRotFolder.add(cameraPos.cameraTarget.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Y');
    // targetRotFolder.add(cameraPos.cameraTarget.rotation, 'z', -Math.PI, Math.PI, 0.01).name('Z');

    // const targetRotDisplay = {
    //   get value() {
    //     return `(${cameraPos.cameraTarget.rotation.x.toFixed(2)}, ${cameraPos.cameraTarget.rotation.y.toFixed(2)}, ${cameraPos.cameraTarget.rotation.z.toFixed(2)})`;
    //   }
    // };
    // targetRotFolder.add(targetRotDisplay, 'value').name('Display').listen().disable();

    return gui;
  }

  export function setupDayNightGUI(controller: DayNightController, name: string = "Day/Night"): GUI {
    const gui = new GUI({ title: name });

    const actions = {
      setMorning: () => controller.setMorning(),
      setDay: () => controller.setDay(),
      setEvening: () => controller.setEvening(),
      setNight: () => controller.setNight(),
    };

    gui.add(actions, 'setMorning').name('Morning');
    gui.add(actions, 'setDay').name('Day');
    gui.add(actions, 'setEvening').name('Evening');
    gui.add(actions, 'setNight').name('Night');

    return gui;
  }
}

export function lerp(from: number, to: number, speed: number) {
  const amount = (1 - speed) * from + speed * to
  return Math.abs(from - to) < 0.001 ? to : amount
}

export function setupOrbitControls(camera: PerspectiveCamera, renderer: WebGLRenderer): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  return controls;
}