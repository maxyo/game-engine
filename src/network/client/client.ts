import * as shortid from 'shortid';
import {EventSourceTrait} from "../../core/event/event-source-trait";
import {Socket} from "socket.io";
import {Interface} from "readline";
import Serializer from "../transport/serializer";
import {Player} from "../../core/player";

/**
 * events:
 * - close
 */
export class Client extends EventSourceTrait {
    public readonly id: string;
    private readonly socket: Socket;
    private currentInterface: Interface;
    private serializer: Serializer;

    public readonly players: Map<number, Player> = new Map<number, Player>();

    private _networkAge: number = 0;

    public get networkAge() {
        return this._networkAge;
    }

    constructor(socket: Socket, serializer: Serializer) {
        super();
        this.id = shortid.generate();
        this.socket = socket;
        this.serializer = serializer;
    }

    public close() {
        this.socket.disconnect(true);
        this.trigger('close');
    }
}

export enum ClientType {
    FRONTEND,
    PLAYER,
}
