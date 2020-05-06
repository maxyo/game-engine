import {Command} from "./command";
import {Transport} from "./transport/transport";

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
        this.transport.broadcast(this.commands);
        this.commands = [];
    }
}
