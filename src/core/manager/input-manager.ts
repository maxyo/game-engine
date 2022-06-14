import {Manager} from "./manager";
import {INetworkManager, IUpdatableManager} from "./manager-types";
import {Command} from "../../network/command/command";
import {Game} from "../game";
import {EventSourceTrait} from "../event/event-source-trait";
import {use} from "typescript-mix";

export interface InputManager extends EventSourceTrait {

}

export class InputManager extends Manager implements IUpdatableManager, INetworkManager {
    @use(EventSourceTrait) this;

    private commands: Command[] = [];
    private frame: HTMLElement;

    constructor(game: Game) {
        super(game);
        this.frame = window.document.getElementById('game-frame') as HTMLCanvasElement;
        this.frame.addEventListener('click', (e) => {
        });

        this.frame.addEventListener('contextmenu', (e) => {

        });

        window.document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.trigger('keydown', e.code);
        });

        window.document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.trigger('keyup', e.code);
        })

    }

    public async update() {
        return Promise.resolve();
    }

    async getCommands(): Promise<Command[] | undefined> {
        if (this.commands.length != 0) {
            let result = this.commands;
            this.commands = [];
            return result;
        }
    }
}
