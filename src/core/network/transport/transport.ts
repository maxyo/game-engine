import {Client} from "../client/client";
import {Command} from "../command";
import {EventSourceTrait} from "../../event/event-source-trait";
import {Game} from "../../game";
import Serializer from "./serializer";
import {CommandCollection} from "../commands/command-collection";

/**
 * Класс реализующий отправку данных (Transportable) клиенту и получение действий от клиента.
 */
export abstract class Transport extends EventSourceTrait {
    protected game: Game;
    protected readonly serializer: Serializer;

    protected constructor(game: Game) {
        super();
        this.serializer = new Serializer();
        this.serializer.loadClasses();
        this.game = game;
    }

    abstract broadcast(buf);

    abstract send(client: Client, data: Command | [Command]);

    abstract emit(event: string, data: any);

    protected packCommands(data: Command[]): ArrayBuffer {
        return new CommandCollection(data).serialize(this.serializer).dataBuffer;
    }

    protected unpackCommands(buffer): CommandCollection {
        return this.serializer.deserialize(buffer).obj as CommandCollection;
    }

    protected handleCommands(commands: CommandCollection) {
        commands.execute(this.game, this.serializer);
    }
}
