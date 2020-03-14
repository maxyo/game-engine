import {Transport} from "../transport";
import * as io from "socket.io-client";
import {Client} from "../../client/client";
import {Command} from "../../commands/command";
import Socket = SocketIOClient.Socket;

export class WebsocketClient extends Transport {
    socket: Socket;

    constructor(server: string, port: string) {
        super();

        this.socket = io(server + ':' + port);

        this.socket.on('data', (data) => {
            this.handleCommand(data as Command)
        })
    }

    broadcast(buf) {
        this.socket.send(buf);
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    send(client: Client, data: Command | [Command]) {
        this.socket.send(data);
    }

    handleCommand(command: Command) {
        console.log(command);
    }
}
