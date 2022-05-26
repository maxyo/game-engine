import {Game} from "../game";
import {Component} from "../component/component";
import {Atom} from "../scene/atom";

export abstract class Manager {
    protected game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public init() {

    }

    protected handleComponentsAt(type, arr: Component[]) {
        this.game.getScene().attachEventListener('attached', (event) => Manager.catchComponent(event.data[0], type, arr));
        this.game.getScene().attachEventListener('detached', (event) => Manager.removeComponent(event.data[0], type, arr));
        this.game.getScene().getObjects().forEach(obj => Manager.catchComponent(obj, type, arr))
    }

    private static catchComponent(atom: Atom, type, store: Component[]) {
        let component = atom.getComponent(type)
        if (component) {
            store.push(component);
        }
    }

    private static removeComponent(atom: Atom, type, store: Component[]) {
        let component = atom.getComponent(type)
        if (component) {
            store.push(component);
        }
    }

}

export abstract class ServerManager extends Manager {

}
