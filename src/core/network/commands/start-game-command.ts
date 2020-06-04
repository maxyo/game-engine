import {ClientCommand, registerCommand} from "./command";
import Serializer, {registerClass} from "../transport/serializer";
import { Client } from "../client/client";
import { Game } from "src/core/game";
import {GamePlayerManager} from "../../manager/game-player-manager";

@registerClass
export class StartGameCommand extends ClientCommand{
    execute(game: Game, serializer: Serializer, client: Client) {
        game.getManager(GamePlayerManager).initPlayers()
    }

}
