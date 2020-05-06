import * as shortid from 'shortid';
import {EventSourceTrait} from "../../event/event-source-trait";
import {Socket} from "socket.io";
import {GetCommand} from "../commands/get-command";
import {ActionCommand} from "../commands/action-command";
import {Interface} from "readline";

/**
 * events:
 * - close
 */
export class Client extends EventSourceTrait {
    public readonly id: string;
    private readonly socket: Socket;
    private currentInterface: Interface;

    constructor(socket: Socket) {
        super();
        this.id = shortid.generate();
        this.socket = socket;

        this.setUpListeners();

        this.socket.emit('message', 'hello');
    }

    public close() {
        this.socket.disconnect(true);
        this.trigger('close');
    }

    private onAction(data: ActionCommand) {
        this.trigger('action', data.action);
    }

    private onGetInterface(data: GetCommand) {
        this.socket.emit('data', this.currentInterface);
    }

    private setUpListeners() {
        this.socket.on('action', (data) => {
            this.onAction(this.parse(data) as ActionCommand)
        });
        this.socket.on('get', (data: string) => {
            this.onGetInterface(this.parse(data) as GetCommand)
        });
    }

    private parse(data) {
        return JSON.parse(data);
    }
}
