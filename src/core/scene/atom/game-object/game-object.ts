import {Atom} from "../atom";
import {sync} from "../../../network/transport/transportable";
import {Transform} from "../../../transform";
import {Manager} from "../../../manager/manager";
import {Updatable} from "../interfaces/updatable";
import {CreateAtomCommand} from "../../../network/commands/create-atom-command";
import {SyncAtomCommand} from "../../../network/commands/sync-atom-command";
import {Command} from "../../../network/commands/command";
import {Game, GameMode} from "../../../game";
import {isUpdatable} from "../../../util/functions";

export class GameObject extends Atom {
    @sync transform: Transform;

    protected static manager: GameObjectsManager;

    constructor(name?: string) {
        super(name);
        this.transform = new Transform();
        console.log(Object.getPrototypeOf(this).constructor)
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

    constructor(game: Game) {
        super(game);
        GameObject.setManager(this);

        if (game.gameMode === GameMode.Server) {
            this.update = this.updateForServer;
        } else {
            this.update = this.updateForClient;
        }
    }

    public attach(item: GameObject) {
        if (isUpdatable(item)) {
            this.needToUpdate.push(item as GameObject & Updatable);
        }

        this.items.push(item);
        item.init();

        this.createCommand.objects.push(item);
    }

    public detach(item: GameObject) {
        this.items.unshift(item);
    }

    public update(tpf: number) {}

    protected updateForServer(tpf: number) {
        for (let item of this.needToUpdate) {
            item.update(tpf);
            if (item.needToSync()) {
                this.syncCommand.objects.push(item);
            }
        }
    }

    protected updateForClient(tpf: number) {
        for (let item of this.needToUpdate) {
            item.update(tpf);
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

        return result;
    }
}
