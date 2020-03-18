import {Client} from "../client/client";
import {Command} from "../command";
import {EventSource} from "../../event/event-source";
import {Game} from "../../game";

/**
 * Класс реализующий отправку данных (Transportable) клиенту и получение действий от клиента.
 */
export abstract class Transport extends EventSource {
    protected game: Game;

    constructor(game: Game) {
        super();
        this.game = game;
    }

    abstract broadcast(buf);

    abstract send(client: Client, data: Command | [Command]);

    abstract emit(event: string, data: any);

    protected packCommands(data: Command[]) {
        let result = [];
        for (let command of data) {
            result.push(command.serialize());
        }
        return JSON.stringify(result);
    }

    protected unpackCommands(data: string) {
        let parsed = JSON.parse(data);
        let result = [];
        for (let command of parsed) {
            console.log(command);
            result.push(Command.unserialize(command));
        }
        console.log(result);
        return result;
    }
}
