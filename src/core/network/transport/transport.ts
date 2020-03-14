import {Client} from "../client/client";
import {Command} from "../commands/command";
import {EventSource} from "../../event/event-source";

/**
 * Класс реализующий отправку данных (Transportable) клиенту и получение действий от клиента.
 */
export abstract class Transport extends EventSource {
    abstract broadcast(buf);

    abstract send(client: Client, data: Command | [Command]);

    abstract emit(event: string, data: any);
}
