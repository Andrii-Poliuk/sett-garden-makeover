//import { Application, Assets, Sprite } from "pixi.js";
import { EventSystem, WebGLRenderer } from 'pixi.js';
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js'
import GameScene from './GameScene';
import UIScene from './UI/UIScene';
import Game from './Game/Game';

(async () => {
  let WIDTH = window.innerWidth;
  let HEIGHT = window.innerHeight;

  const threeRenderer = new THREE.WebGLRenderer({
    antialias: true,
    stencil: true,
  });

  threeRenderer.setSize(WIDTH, HEIGHT);
  threeRenderer.setClearColor(0xdddddd, 1);
  document.body.appendChild(threeRenderer.domElement);

  const pixiRenderer = new WebGLRenderer();
  await pixiRenderer.init({
    context: threeRenderer.getContext() as WebGL2RenderingContext,
    width: WIDTH,
    height: HEIGHT,
    clearBeforeRender: false,
  });

  const uiScene = new UIScene();
  await uiScene.init();

  const threeScene = new GameScene(threeRenderer);
  await threeScene.init();

  Game.instance.init(threeScene, uiScene);

  // PixiJS DevTools support
  (globalThis as any).__PIXI_STAGE__ = uiScene.stage;
  (globalThis as any).__PIXI_RENDERER__ = pixiRenderer;

  // Set up PixiJS event system on the Three.js canvas
  const eventSystem = new EventSystem(pixiRenderer);
  eventSystem.domElement = threeRenderer.domElement as HTMLCanvasElement;
  eventSystem.setTargetElement(threeRenderer.domElement as HTMLCanvasElement);
  eventSystem.resolution = pixiRenderer.resolution;
  uiScene.stage.eventMode = 'static';

  const stats = new Stats()
  document.body.appendChild(stats.dom)

  const clock = new THREE.Clock()
  let delta = 0

  function loop() {
    delta = clock.getDelta()
    threeScene.update(delta)
    Game.instance.update(delta);
    uiScene.update(delta);

    threeRenderer.resetState();
    threeRenderer.render(threeScene.scene, threeScene.camera);

    pixiRenderer.resetState();
    pixiRenderer.render({ container: uiScene.stage });

    stats.update()

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    threeRenderer.setSize(WIDTH, HEIGHT);
    threeScene.resize(WIDTH, HEIGHT);

    pixiRenderer.resize(WIDTH, HEIGHT);
    uiScene.resize(WIDTH, HEIGHT);
  });

  await Game.instance.startGame();
})();


/*
(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("/assets/bunny.png");

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
  });
})();
*/