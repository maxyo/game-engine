import {Transport} from "../transport";
import {Client} from "../../client/client";
import {Command} from "../../commands/command";
import {Game} from "../../../game";
import * as Websocket from 'ws';
import {isDirectCommand} from "../../commands/idirect-command";

export class ServerTransport extends Transport {
    clientsCollection: ClientCollection = new ClientCollection();
    server: Websocket.Server;

    constructor(game: Game, config: {}) {
        super(game);
        this.server = new Websocket.Server(config);
        this.server.addListener("close", (connection) => this.onClose(connection, 1, ''));
        this.server.addListener("connection", (connection) => this.onConnection(connection));
        console.log('Start Listening');
    }

    broadcast(data: Command[]) {
        this.clientsCollection.clients.forEach((client) => {
            this.clientsCollection.getSocket(client.id).send(this.packCommands(this.collectForClient(data, client)));
        })
    }

    emit(event: string, data: any) {
        this.server.emit(event, data);
    }

    send(client: Client, data: Command[]) {
        this.server.emit('message', this.packCommands(data));
    }

    onData(client: Client, data: ArrayBuffer) {
        this.handleCommands(this.unpackCommands(data), client);
    }

    onConnection(socket: Websocket) {
        let client = new Client(socket, this.serializer);
        this.clientsCollection.add(client, socket);
        console.log('client connected (' + client.id + ')');
        socket.binaryType = "arraybuffer";
        this.trigger('connect', client);
        socket.onmessage = (data) => {
            this.onData(client, data.data as ArrayBuffer);
        };
    }

    onClose(socket: Websocket, reason: number, desc: string) {
        let client = this.clientsCollection.getBySocket(socket);
        client.close();
        this.trigger('disconnect', client);
        console.log('client disconnected (' + client.id + ')');
    }

    collectForClient(commands: Command[], client: Client): Command[] {
        let result = [];
        commands.forEach((command) => {
            if (isDirectCommand(command)) {
                if (command.is(client)) {
                    result.push(command)
                }
            } else {
                result.push(command);
            }
        })
        return result;
    }

}

class ClientCollection {
    clients: Map<string, Client>;
    sockets: Map<string, Websocket>;

    constructor() {
        this.clients = new Map<string, Client>();
        this.sockets = new Map<string, Websocket>();
    }

    public getClient(clientId: string): Client {
        return this.clients[clientId];
    }

    public getSocket(clientId: string): Websocket {
        return this.sockets.get(clientId);
    }

    public getBySocket(socket: any): Client {
        for (let [clientId, s] of Object.entries(this.sockets)) {
            if (socket == s) {
                return this.clients[clientId];
            }
        }
    }

    public remove(clientId: string) {
        delete this.clients[clientId];
        delete this.sockets[clientId];
    }

    public add(client: Client, socket: Websocket) {
        this.sockets.set(client.id, socket);
        this.clients.set(client.id, client);
    }
}
