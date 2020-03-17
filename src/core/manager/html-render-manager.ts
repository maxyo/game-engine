import {Manager} from "./manager";
import {Game} from "../game";
import {Atom} from "../scene/atom/atom";
import {RenderComponent} from "../component/render-component";
import {GameObject} from "../scene/atom/game-object/game-object";
import {Tile} from "../scene/atom/tile/tile";

export class HtmlRenderManager extends Manager {
    private frame: HTMLElement;

    private items: RenderComponent[];

    constructor(game: Game) {
        super(game);
        this.frame = window.document.getElementById('game-frame');
        this.frame.style.width = '100vw';
        this.frame.style.height = '100vh';
        this.frame.style.position = 'relative';

        this.game.getScene().attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data));
        this.game.getScene().attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data));

        this.game.getScene().getObjects().forEach((obj: GameObject) => {
            this.onSceneAtomAttached(obj)
        });
        this.game.getScene().getTiles().forEach((obj: Tile) => {
            this.onSceneAtomAttached(obj)
        });
    }

    update(tick_lag: number): void {
        let scene = this.game.getScene();

        if (!scene) {
            return
        }

        let nodes = [];

        for (let comp of this.items) {
            let newElement = document.createElement('div');
            newElement.style.position = 'absolute';
            newElement.style.width = '10px';
            newElement.style.height = '10px';
            newElement.style.background = 'blue';
            newElement.style.left = comp.go.position.x + "px";
            newElement.style.top = comp.go.position.y + "px";

            nodes.push(newElement);
        }

        this.frame.innerHTML = '';
        this.frame.append(...nodes);
    }

    onSceneAtomAttached(atom: Atom) {
        let component = atom.getComponent(RenderComponent);
        if (component) {
            this.attach(component);
        }

        component.attachEventListener('destroy', (event) => {
            this.detach(event.target as RenderComponent)
        });
    }

    onSceneAtomDetached(atom: Atom) {

    }

    private attach(component: RenderComponent) {
        this.items.push(component);
    }

    private detach(component: RenderComponent) {
        const pos = this.items.indexOf(component);
        if (pos !== -1) {
            this.items.splice(pos, 1);
        }
    }
}
