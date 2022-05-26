import {Transport} from "./transport";
import {Command} from "../command/command";
import {Game} from "../../core/game";
import {Client} from "../client/client";

export class NullTransport extends Transport {
    constructor(game: Game) {
        super(game);
    }

    broadcast(buf) {
    }

    send(client: Client, data: Command[]) {
    }
}