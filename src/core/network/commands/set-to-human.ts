import {ServerCommand} from "./command";
import Serializer, {registerClass} from "../transport/serializer";
import {Game} from "src/core/game";
import {GamePlayerManager} from "../../manager/game-player-manager";
import {NetworkType} from "../transport/network-type";
import {HumanComponent} from "../../component/human-component";
import {IDirectCommand} from "./idirect-command";
import {Client} from "../client/client";

@registerClass
export class setToHuman extends ServerCommand implements IDirectCommand {
    execute(game: Game, serializer: Serializer) {
        game.getManager(GamePlayerManager).setLocalHuman(this.human);
    }

    private human: HumanComponent;
    private client: Client;

    static get netScheme() {
        return {
            human: {type: NetworkType.REFERENCE},
        }
    }

    is(client: Client): boolean {
        return client === this.client;
    }
}
