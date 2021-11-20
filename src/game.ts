import 'Phaser';
import {MainScene} from "./scenes/main-scene";
import pack from "../package.json"

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
    const GameConfig: Phaser.Types.Core.GameConfig = {
        title: pack.name,
        url: pack.homepage,
        version: pack.version,
        width: 1200,
        height: 800,
        backgroundColor: 0x050505,
        type: Phaser.AUTO,
        parent: 'game',
        physics: {
            default: 'arcade',
            arcade: {
            }
        },
        scene: [MainScene]
    };
  const game = new Game(GameConfig);
});
