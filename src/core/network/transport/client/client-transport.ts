import {Transport} from "../transport";
import {Client} from "../../client/client";
import {Command} from "../../commands/command";
import {Game} from "src/core/game";

export class ClientTransport extends Transport {

    private stack: Command[] = [];

    send(client: Client, data: Command[]) {
        throw new Error("Method not implemented.");
    }

    socket: WebSocket;

    constructor(game: Game, server: string, port: string) {
        super(game);

        this.socket = new WebSocket('ws://' + server + ':' + port)
        this.socket.binaryType = "arraybuffer";

        this.socket.onmessage = (data) => {
            // @ts-ignore
            this.handleCommands(this.unpackCommands(data.data));
        };
    }

    broadcast(data: Command[]) {
        if (this.socket.readyState === 0) {
            this.stack.push(...data);
            return;
        }

        if (this.stack.length !== 0) {
            data.unshift(...this.stack);
            this.stack = [];
        }
        console.log(data);
        this.socket.send(this.packCommands(data));
    }
}
