import {Command} from "./command";

export class ActionCommand extends Command {
    constructor(action: string, target: string) {
        super();
        this.action = action;
        this.target = target;
    }

    action: string;
    target: string;

    execute() {
    }

}
