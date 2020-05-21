import {ClientCommand} from "./command";
import Serializer, {registerClass} from "../transport/serializer";
import {Game} from "../../game";
import {Client} from "../client/client";
import {Player} from "../../player";
import {NetworkType} from "../transport/network-type";

@registerClass
export class InitPlayerCommand extends ClientCommand {
    player: Player

    static get netScheme() {
        return {
            player: {type: NetworkType.CLASSINSTANCE}
        };
    }

    execute(game: Game, serializer: Serializer, client: Client) {
        game.attachPlayer(this.player);
        client.players.set(this.player.id, this.player);
    }
}