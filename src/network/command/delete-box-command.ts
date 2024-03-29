import {Game} from "../../core/game";
import Serializer, {registerClass} from "../transport/serializer";
import {Client} from "../client/client";
import {AtomManager} from "../../core/manager/atom-manager";
import {ClientCommand} from "./command";
import {Atom} from "../../core";

@registerClass
export class DeleteBoxCommand extends ClientCommand {
    execute(game: Game, serializer: Serializer, client: Client) {
        let go: Atom | null = null;
        for (let obj of game.getScene().getObjects()) {
            go = obj;
            break;
        }
        if (go) {
            game.getManager(AtomManager)?.destroy(go);
        }
    }
}
