import {ClientCommand} from "./command";
import Serializer, {registerClass} from "../transport/serializer";
import {Client} from "../client/client";
import {Game} from "src/core/game";
import {GamePlayerManager} from "../../manager/game-player-manager";
import {NetworkType} from "../transport/network-type";

@registerClass
export class MoveCommand extends ClientCommand {
    private dir = 0;

    constructor(dir) {
        super();
        this.dir = dir;
    }

    static get netScheme() {
        return {
            ...super.netScheme,
            dir: {type: NetworkType.INT8},
        }
    }

    execute(game: Game, serializer: Serializer, client: Client) {
        game.getManager(GamePlayerManager).networkMove(client, this.dir);
    }

}
