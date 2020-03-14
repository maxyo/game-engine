import {Command} from "./commands/command";
import {Transport} from "./transport/transport";
import {encode} from "msgpack";

export class NetworkService {
    private commands: Command[] = [];
    private transport: Transport;

    constructor(transport: Transport) {
        this.transport = transport;
    }

    public pushCommands(commands: Command[]) {
        if (commands) {
            this.commands.push(...commands);
        }
    }

    public transmit() {
        if (!this.commands.length) {
            return;
        }

        this.transport.broadcast(encode(this.commands));
        this.commands = [];
    }
}
