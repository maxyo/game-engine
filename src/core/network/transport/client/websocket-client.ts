import {Transport} from "../transport";
import * as io from "socket.io-client";
import {Client} from "../../client/client";
import {Command} from "../../command";
import {Socket} from "socket.io";
import {Game} from "src/core/game";

export class WebsocketClient extends Transport {
    socket: Socket;

    constructor(game: Game, server: string, port: string) {
        super(game);

        this.socket = io(server + ':' + port);

        this.socket.on('data', (data) => {
            this.handleCommand(this.unpackCommands(data))
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

    handleCommand(commands: Command[]) {
        for (let command of commands) {
            command.execute(this.game);
        }
    }
}
