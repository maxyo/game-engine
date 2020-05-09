import {Manager} from "./manager";
import {Game} from "../game";
import {Atom} from "../scene/atom/atom";
import {GameObject} from "../scene/atom/game-object/game-object";
import {Tile} from "../scene/atom/tile/tile";
import {LogicComponent} from "../component/logic-component";

export class LogicManager extends Manager {
    private frame: HTMLElement;

    private items: LogicComponent[] = [];

    constructor(game: Game) {
        super(game);
        this.game.getScene().attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data[0]));
        this.game.getScene().attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data[0]));

        this.game.getScene().getObjects().forEach((obj: GameObject) => {
            this.onSceneAtomAttached(obj)
        });
        this.game.getScene().getTiles().forEach((obj: Tile) => {
            this.onSceneAtomAttached(obj)
        });
    }

    update(tick_lag: number): void {
        this.items.map((comp) => comp.update(tick_lag));
    }

    onSceneAtomAttached(atom: Atom) {
        let component = atom.getComponent(LogicComponent);
        if (component) {
            this.attach(component);
            component.attachEventListener('destroy', (event) => {
                this.detach(event.target as LogicComponent)
            });
        }
    }

    onSceneAtomDetached(atom: Atom) {
        this.detach(atom.getComponent(LogicComponent));
    }

    private attach(component: LogicComponent) {
        this.items.push(component);
    }

    private detach(component: LogicComponent) {
        const pos = this.items.indexOf(component);
        if (pos !== -1) {
            this.items.splice(pos, 1);
        }
    }
}
