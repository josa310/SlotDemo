import './style.css'
import * as PIXI from 'pixi.js';
import { LayoutManager } from './utils/LayoutManager';
import { ServiceLocator } from './serviceLocator/ServiceLocator';
import { Grid } from './modules/Grid/Grid';
import { Game } from './modules/Game/Game';
import { UI } from './modules/UI/UI';
import { Config } from './modules/Config';
import { RGS } from './modules/RGS/RGS';
import { CascadeSpinFeature } from './features/spin/CascadeSpinFeature';
import { WinFeature } from './features/win/Win';
import { FreespinFeature } from './features/freespin/Freespin';

export const app = new PIXI.Application();
globalThis.__PIXI_APP__ = app;

async function init() {
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x555555,
    resolution: window.devicePixelRatio || 1,
  });

  document.body.appendChild(app.canvas);
    
  createModules();
  await ServiceLocator.moduleHandler.initModules();

  createFeatures();
  await ServiceLocator.featureHandler.initModules();

  new LayoutManager(app);
}

function createModules() {
  const handler = ServiceLocator.moduleHandler;
  handler.register(new RGS());
  handler.register(new Config());
  handler.register(new UI());
  handler.register(new Grid());
  handler.register(new Game(app.stage));
}

function createFeatures() {
  const handler = ServiceLocator.featureHandler;
  handler.register(new CascadeSpinFeature());
  handler.register(new WinFeature());
  handler.register(new FreespinFeature());
}

init();