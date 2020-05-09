import {Transport} from "../transport";
import * as io from "socket.io-client";
import {Client} from "../../client/client";
import {Command} from "../../command";
import {Socket} from "socket.io";
import {Game} from "src/core/game";
import {CommandCollection} from "../../commands/command-collection";

export class ClientTransport extends Transport {
    socket: Socket;

    constructor(game: Game, server: string, port: string) {
        super(game);

        this.socket = io(server + ':' + port);

        this.socket.on('command', (data) => {
            this.handleCommands(this.unpackCommands(data));
        })
    }

    broadcast(data: Command[]) {
        console.log(this.packCommands(data));
        this.socket.emit('command', this.packCommands(data));
    }

    emit(event: string, data: any) {
        this.socket.emit(event, data);
    }

    send(client: Client, data: Command | [Command]) {
        this.socket.send(data);
    }
}
