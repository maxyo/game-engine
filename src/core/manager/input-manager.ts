import {Manager} from "./manager";
import {INetworkManager, IUpdatableManager} from "./manager-types";
import {Command} from "../network/commands/command";
import {Game} from "../game";
import {ClickInputAction} from "../input/input-action";
import {SpawnBoxCommand} from "../network/commands/spawn-box-command";
import {ChangeColorCommand} from "./change-color-command";
import {EventSourceTrait} from "../event/event-source-trait";
import {use} from "typescript-mix";

export interface InputManager extends EventSourceTrait{

}

export class InputManager extends Manager implements IUpdatableManager, INetworkManager {
    @use(EventSourceTrait) this;

    private commands: Command[] = [];
    private frame: HTMLElement;

    constructor(game: Game) {
        super(game);
        this.frame = window.document.getElementById('game-frame');
        this.frame.addEventListener('click', (e) => {
        });

        this.frame.addEventListener('contextmenu', (e) => {

        });

        window.document.addEventListener('keydown', (e: KeyboardEvent) => {
            if(e.repeat){
                return;
            }
            this.trigger('keydown', e.code);
        });

        window.document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.trigger('keyup', e.code);
        })

    }

    public update() {

    }

    getCommands(): Command[] | null {
        if (this.commands.length != 0) {
            let result = this.commands;
            this.commands = [];
            return result;
        }
        return null;
    }
}
