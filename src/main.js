import { createGameScene } from './game/gameEntry.js';

console.log(import.meta.env.BASE_URL);

const container = document.body;
createGameScene(container);
