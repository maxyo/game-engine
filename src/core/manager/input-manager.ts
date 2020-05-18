import {Manager} from "./manager";
import {INetworkManager, IUpdatableManager} from "./manager-types";
import {Command} from "../network/commands/command";
import {Game} from "../game";
import {ClickInputAction} from "../input/input-action";
import {SpawnBoxCommand} from "../network/commands/spawn-box-command";
import {DeleteBoxCommand} from "../network/commands/delete-box-command";
import {ChangeColorCommand} from "./change-color-command";

export class InputManager extends Manager implements IUpdatableManager, INetworkManager {
    private commands: Command[] = [];
    private frame: HTMLElement;

    constructor(game: Game) {
        super(game);
        this.frame = window.document.getElementById('game-frame');
        this.frame.addEventListener('click', (e) => {
            let action = new ClickInputAction();
            // @ts-ignore
            action.x = event.x;
            // @ts-ignore
            action.y = event.y;
            this.commands.push(new SpawnBoxCommand({x: e.x, y: e.y}));
        });

        this.frame.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.commands.push(new ChangeColorCommand());
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
