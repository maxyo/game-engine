import {Manager} from "./manager";
import {Updatable} from "../scene/atom/interfaces/updatable";
import {Game} from "../game";

export class HtmlRenderManager extends Manager {
    private frame: HTMLElement;


    constructor(game: Game) {
        super(game);
        this.frame = window.document.getElementById('game-frame');
        this.frame.style.width = '100vw';
        this.frame.style.height = '100vh';
        this.frame.style.position = 'relative';
    }

    update(tick_lag: number): void {
        let scene = this.game.getScene();

        if (!scene) {
            return
        }

        let nodes = [];

        for (let go of scene.objects) {
            let newElement = document.createElement('div');
            newElement.style.position = 'absolute';
            newElement.style.width = '10px';
            newElement.style.height = '10px';
            newElement.style.background = 'blue';
            newElement.style.left = go.transform.position.x + "px";
            newElement.style.top = go.transform.position.y + "px";


            nodes.push(newElement);
        }

        this.frame.innerHTML = '';
        this.frame.append(...nodes);
    }
}
