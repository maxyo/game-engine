import {Manager} from "./manager";
import {isUpdatable, IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {CreateAtomCommand} from "../network/commands/create-atom-command";
import {SyncAtomCommand} from "../network/commands/sync-atom-command";
import {Game} from "../game";
import {Command} from "../network/commands/command";
import {GameObject} from "../scene/atom/game-object/game-object";
import {Atom} from "../scene/atom/atom";
import {DeleteAtomCommand} from "../network/commands/delete-atom-command";

export class AtomSyncManager extends Manager {
    private createCommand: CreateAtomCommand = new CreateAtomCommand;
    private deleteCommand: DeleteAtomCommand = new DeleteAtomCommand;
    private syncCommand: SyncAtomCommand = new SyncAtomCommand;

    atoms: Array<Atom> = [];

    constructor(game: Game) {
        super(game);

        game.scene.attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data));
        game.scene.attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data));
    }

    public update(tpf: number) {
        for (let atom of this.atoms) {
            if (atom.needToSync()) {
                this.syncCommand.objects.push(atom);
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

        if (this.deleteCommand.objects.length) {
            result.push(this.deleteCommand);
            this.deleteCommand = new CreateAtomCommand();
        }

        if (result.length) {
            return result;
        }
        return null;
    }

    private onSceneAtomAttached(atom) {
        if (isUpdatable(atom)) {
            this.atoms.push(atom);
        }
        this.createCommand.objects.push(atom);
    }

    private onSceneAtomDetached(atom) {
        let i = this.atoms.indexOf(atom);
        if (i !== -1) {
            this.atoms.slice(i, 1);
        }
        this.deleteCommand.objects.push(atom);
    }
}
