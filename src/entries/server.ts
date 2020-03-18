import {createServer} from "http";
import {Game, GameMode, IGameConfig} from "../core/game";
import {GameObject} from "../core/scene/atom/game-object/game-object";
import {RenderComponent} from "../core/component/render-component";

let args = {};

for (let i = 2; i < process.argv.length; i += 2) {
    args[process.argv[i].slice(2)] = process.argv[i + 1];
}


let config: IGameConfig = {
    mode: GameMode.Server,
    serverConfig: {
        httpServer: createServer().listen(args['port'] ?? 3000),
    }
};

let game = new Game(config);

let obj: GameObject = new GameObject();
setTimeout(() => {
    obj.addComponent(RenderComponent);
    game.getScene().attach(obj);
}, 1000);


game.start();
