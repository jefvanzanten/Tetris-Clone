import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game, Scale } from "phaser";
import { Preloader } from "./scenes/Preloader";

const isLandscapeTablet =
    window.innerWidth > 768 && window.innerWidth > window.innerHeight;

let canvasWidth;

if (isLandscapeTablet) {
    canvasWidth = window.innerWidth * 0.75;
} else {
    canvasWidth = window.innerWidth;
}

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: "game-container",
    backgroundColor: "#028af8",
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        max: {
            width: canvasWidth,
            height: canvasWidth / 1.3333333,
        },
    },
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
