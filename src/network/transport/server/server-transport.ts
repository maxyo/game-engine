import {Transport} from "../transport";
import {Client} from "../../client/client";
import {Command} from "../../command/command";
import {Game} from "../../../core/game";
import * as WebsocketModule from 'ws';
import {ServerOptions} from 'ws';
import {w3cwebsocket} from "websocket";

export class ServerTransport extends Transport {
    clientsCollection: ClientCollection = new ClientCollection();
    server: WebsocketModule.Server;

    constructor(game: Game, config?: ServerOptions) {
        super(game);
        this.server = new WebsocketModule.Server(config);
        this.server.addListener("close", (connection) => this.onClose(connection, 1, ''));
        this.server.addListener("connection", (connection) => this.onConnection(connection as any));
        console.log('Start Listening');
    }

    broadcast(data: Command[]) {
        this.clientsCollection.sockets.forEach((socket) => {
            socket.send(this.packCommands(data));
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

    onConnection(socket: w3cwebsocket) {
        let client = new Client(socket, this.serializer);
        this.clientsCollection.add(client, socket);
        console.log('client connected (' + client.id + ')');
        socket.binaryType = "arraybuffer";
        this.trigger('connect', client);
        socket.onmessage = (data) => {
            this.onData(client, data.data as ArrayBuffer);
        };
    }

    onClose(socket: WebsocketModule, reason: number, desc: string) {
        let client = this.clientsCollection.getBySocket(socket);
        if (!client) {
            return;
        }
        client.close();
        this.trigger('disconnect', client);
        console.log('client disconnected (' + client.id + ')');
    }
}

class ClientCollection {
    clients: Map<string, Client>;
    sockets: Map<string, w3cwebsocket>;

    constructor() {
        this.clients = new Map<string, Client>();
        this.sockets = new Map<string, w3cwebsocket>();
    }

    public getClient(clientId: string): Client {
        return this.clients[clientId];
    }

    public getSocket(clientId: string): w3cwebsocket {
        return this.sockets[clientId];
    }

    public getBySocket(socket: any): Client | undefined {
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

    public add(client: Client, socket: w3cwebsocket) {
        this.sockets.set(client.id, socket);
        this.clients.set(client.id, client);
    }
}
