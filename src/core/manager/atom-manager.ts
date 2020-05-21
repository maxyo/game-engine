import {Manager} from "./manager";
import {CreateAtomCommand} from "../network/commands/create-atom-command";
import {SyncAtomCommand} from "../network/commands/sync-atom-command";
import {Game} from "../game";
import {Command} from "../network/commands/command";
import {GameObject} from "../scene/atom/game-object/game-object";
import {Atom} from "../scene/atom/atom";
import {DeleteAtomCommand} from "../network/commands/delete-atom-command";
import {Tile} from "../scene/atom/tile/tile";
import {Client} from "../network/client/client";

export class AtomManager extends Manager {
    private createCommand: CreateAtomCommand = new CreateAtomCommand;
    private deleteCommand: DeleteAtomCommand = new DeleteAtomCommand;
    private syncCommand: SyncAtomCommand = new SyncAtomCommand;
    private tick_to_update = 100;
    private tick_count = 0;

    atoms: Array<Atom> = [];

    constructor(game: Game) {
        super(game);

        this.game.getScene().attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data));
        this.game.getScene().attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data));

        this.game.getScene().getObjects().forEach((obj: GameObject) => this.onSceneAtomAttached(obj));
        this.game.getScene().getTiles().forEach((obj: Tile) => this.onSceneAtomAttached(obj));

        if (!this.game.isServer) {
            Reflect.deleteProperty(this.constructor.prototype, 'update');
            Reflect.deleteProperty(this.constructor.prototype, 'getCommands');
        }
    }

    public update(tpf: number) {
        this.tick_count++;
        if (this.tick_count > this.tick_to_update) {
            this.tick_count = 0;
            for (let atom of this.atoms) {
                this.syncCommand.objects.push(atom);
            }
        }
    }

    getCommands(client: Client): Command[] | null {
        let result = [];

        if (this.createCommand.objects.length) {
            result.push(this.createCommand);
            this.createCommand = new CreateAtomCommand();
        }

        if (this.syncCommand.objects.length) {
            result.push(this.syncCommand);
            this.syncCommand = new SyncAtomCommand();
        }

        if (this.deleteCommand.objects.length) {
            result.push(this.deleteCommand);
            this.deleteCommand = new DeleteAtomCommand();
        }

        if (result.length) {
            return result;
        }
        return null;
    }

    private onSceneAtomAttached(atoms) {
        atoms.forEach((atom) => {
            this.atoms.push(atom);
        })
    }

    private onSceneAtomDetached(atoms) {
        atoms.forEach((atom) => {
            // this.atoms.remove(atom);
        })
    }

    public spawn(atom: Atom) {
        if (this.game.isServer) {
            this.createCommand.objects.push(atom);
        }
        this.game.getScene().attach(atom);
    }

    public destroy(atom: Atom) {
        if (this.game.isServer) {
            this.deleteCommand.objects.push(atom);
        }
        this.game.getScene().detach(atom);

        atom.destroy();
    }
}