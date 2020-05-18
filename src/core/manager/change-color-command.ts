import {ClientCommand} from "../network/commands/command";
import {Game} from "../game";
import Serializer, {registerClass} from "../network/transport/serializer";
import {Client} from "../network/client/client";
import {GameObject} from "../scene/atom/game-object/game-object";
import {RenderComponent} from "../component/render-component";
import {LogicComponent} from "../component/logic-component";
import {RpcManager} from "./rpc-manager";

@registerClass
export class ChangeColorCommand extends ClientCommand {
    execute(game: Game, serializer: Serializer, client: Client) {
        let go: GameObject = null;
        for (let obj of game.getScene().getObjects()) {
            go = obj;
            break;
        }
        let comp = go.getComponent(LogicComponent);
        game.clients.forEach((client) =>game.getManager(RpcManager).callOnComponent(client, comp, 'randomColor'));
    }
}