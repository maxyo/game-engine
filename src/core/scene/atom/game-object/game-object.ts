import {Atom} from "../atom";
import {sync} from "../../../network/transport/transportable";
import {Transform} from "../../../transform";
import {Manager} from "../../../manager/manager";
import {IUpdatable} from "../interfaces/IUpdatable";
import {CreateAtomCommand} from "../../../network/commands/create-atom-command";
import {SyncAtomCommand} from "../../../network/commands/sync-atom-command";
import {Command} from "../../../network/commands/command";
import {Game} from "../../../game";

export class GameObject extends Atom {
    @sync transform: Transform;

    constructor(name?: string) {
        super(name);
        this.transform = new Transform();
    }

    public destroy() {
        super.destroy();
    }

}