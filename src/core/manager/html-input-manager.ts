import {Manager} from "./manager";
import {INetworkManager} from "./manager-types";
import {Command} from "../network/command";
import {Game} from "../game";
import {InputCommand} from "../network/commands/input-command";
import {ClickInputAction, InputActionType} from "../input/input-action";

export class HtmlInputManager extends Manager implements INetworkManager {
    private frame: HTMLElement;

    private commands: InputCommand[] = [];

    constructor(game: Game) {
        super(game);
        this.frame = window.document.getElementById('game-frame');
        this.frame.addEventListener('click', () => {
            let action = new ClickInputAction();
            action.x = event.x;
            action.y = event.y;
            this.commands.push(InputCommand.create(
                action
            ));
        })
    }

    getCommands(): Command[] | null {
        if (this.commands.length > 0) {
            let result = this.commands;
            this.commands = [];
            return result;
        }
        return null;
    }

}
