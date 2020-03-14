import {Atom} from "../atom";
import {sync} from "../../../network/transport/transportable";
import {Transform} from "../../../transform";
import {Manager} from "../../../manager/manager";
import {Updatable} from "../interfaces/updatable";
import {CreateAtomCommand} from "../../../network/commands/create-atom-command";
import {SyncAtomCommand} from "../../../network/commands/sync-atom-command";
import {Command} from "../../../network/commands/command";

export class GameObject extends Atom {
    @sync transform: Transform;

    protected static manager: GameObjectsManager;

    protected constructor(name?: string) {
        super(name);
        this.transform = new Transform();
    }

    public static create(...args): GameObject {
        let go = new GameObject(...args);
        this.manager.attach(go);
        return go;
    }

    public destroy() {
        super.destroy();
    }

}

export class GameObjectsManager extends Manager {
    protected items: GameObject[] = [];

    protected needToUpdate: Array<GameObject & Updatable> = [];

    private createCommand: CreateAtomCommand = new CreateAtomCommand;
    private syncCommand: SyncAtomCommand = new SyncAtomCommand;

    constructor() {
        super();
        GameObject.setManager(this);
    }

    public attach(item: GameObject) {
        if (item instanceof Updatable) {
            this.needToUpdate.push(item);
        }

        this.items.push(item);
        item.init();

        this.createCommand.objects.push(item);
    }

    public detach(item: GameObject) {
        this.items.unshift(item);
    }

    public update(tpf: number) {
        for (let item of this.needToUpdate) {
            item.update(tpf);
            if (item.needToSync()) {
                this.syncCommand.objects.push(item);
            }
        }
    }

    flushCommands(): Command[] | null {
        let result = [];

        if (this.syncCommand.objects.length) {
            result.push(this.syncCommand);
            this.syncCommand = new SyncAtomCommand();
        }

        if (this.createCommand.objects.length) {
            result.push(this.createCommand);
            this.createCommand = new CreateAtomCommand();
        }

        if (result.length) {
            return result;
        }
        return null;
    }

}
