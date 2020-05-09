import {IServerConfig} from "websocket";
import {Transport} from "../transport";
import {Client} from "../../client/client";
import * as socketio from 'socket.io'
import {Server, Socket} from 'socket.io'
import {Command} from "../../command";
import {Game} from "../../../game";

export class ServerTransport extends Transport {
    clientsCollection: ClientCollection = new ClientCollection();
    server: Server;

    constructor(game: Game, config: IServerConfig) {
        super(game);
        this.server = socketio(config.httpServer, {
            path: '/',
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });

        this.server.on("close", (connection) => this.onClose(connection, 1, ''));
        this.server.on("connection", (connection) => this.onConnection(connection));
        console.log('Start Listening');
    }

    broadcast(data: Command[]) {
        this.server.emit('command', this.packCommands(data));
    }

    emit(event: string, data: any) {
        this.server.emit(event, data);
    }

    send(client: Client, data: Command) {
        this.clientsCollection.getSocket(client.id).write(data.serialize(this.serializer, {}));
    }

    onData(client: Client, data: Buffer) {
        console.log(data[0]);
        this.handleCommands(this.unpackCommands(data.buffer));
    }

    onConnection(socket: Socket) {
        let client = new Client(socket, this.serializer);
        this.clientsCollection.add(client, socket);
        console.log('client connected (' + client.id + ')');
        this.trigger('connect', client);
        socket.on('command', (data) => {
            this.onData(client, data);
        });
    }

    onClose(socket: Socket, reason: number, desc: string) {
        let client = this.clientsCollection.getBySocket(socket);
        client.close();
        this.trigger('disconnect', client);
        console.log('client disconnected (' + client.id + ')');
    }
}

class ClientCollection {
    clients: { [key: string]: Client };
    sockets: { [key: string]: Socket };

    constructor() {
        this.clients = {};
        this.sockets = {};
    }

    public getClient(clientId: string): Client {
        return this.clients[clientId];
    }

    public getSocket(clientId: string): Socket {
        return this.sockets[clientId];
    }

    public getBySocket(socket: Socket): Client {
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

    public add(client: Client, socket: Socket) {
        this.sockets[client.id] = socket;
        this.clients[client.id] = client;
    }
}