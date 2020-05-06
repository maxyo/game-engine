import {Transport} from "../transport";
import * as io from "socket.io-client";
import {Client} from "../../client/client";
import {Command} from "../../command";
import {Socket} from "socket.io";
import {Game} from "src/core/game";
import {CommandCollection} from "../../commands/command-collection";

export class WebsocketClient extends Transport {
    socket: Socket;

    constructor(game: Game, server: string, port: string) {
        super(game);

        this.socket = io(server + ':' + port);

        this.socket.on('data', (data) => {
            this.handleCommands(this.unpackCommands(data));
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

    handleCommands(commands: CommandCollection) {
        commands.execute(this.game, this.serializer);
    }
}
