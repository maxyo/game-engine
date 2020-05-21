import {Manager} from "../../core/manager/manager";
import {Game} from "../../core/game";
import {GameObject} from "../../core/scene/atom/game-object/game-object";
import {Tile} from "../../core/scene/atom/tile/tile";
import {Atom} from "../../core/scene/atom/atom";
import {RenderComponent} from "../component/render-component";
import {BoxShape} from "../shape/box-shape";
import {CircleShape} from "../shape/circle-shape";
import {SpriteShape} from "../shape/sprite-shape";

export class CanvasRenderManager extends Manager {
    private frame: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private items: RenderComponent[] = [];

    private imagesCache: WeakMap<ImageData, ImageBitmap> = new WeakMap<ImageData, ImageBitmap>();

    constructor(game: Game) {
        super(game);
        this.frame = window.document.getElementById("game-frame") as HTMLCanvasElement;
        this.context = this.frame.getContext("2d");

        this.game.getScene().attachEventListener('attached', (event) => this.onSceneAtomAttached(event.data[0]));
        this.game.getScene().attachEventListener('detached', (event) => this.onSceneAtomDetached(event.data[0]));

        this.game.getScene().getObjects().forEach((obj: GameObject) => {
            this.onSceneAtomAttached(obj)
        });
        this.game.getScene().getTiles().forEach((obj: Tile) => {
            this.onSceneAtomAttached(obj)
        });
    }

    public update(tpf: number) {
        this.context.clearRect(0, 0, 5000, 5000);
        for (let item of this.items) {
            let shape = item.shape;
            if (shape instanceof BoxShape) {
                this.context.beginPath();
                this.context.rect(item.go.position.x, item.go.position.y, shape.width, shape.height);
                this.context.fillStyle = item.color;
                this.context.fill();
                this.context.closePath();
            } else if (shape instanceof CircleShape) {
                this.context.beginPath();
                this.context.arc(item.go.position.x, item.go.position.y, shape.radius, 0, 360);
                this.context.fillStyle = item.color;
                this.context.fill();
                this.context.closePath();
            } else if (shape instanceof SpriteShape) {
                if (this.imagesCache.has(shape.sprite)) {
                    this.context.beginPath();
                    this.context.drawImage(this.imagesCache.get(shape.sprite), item.go.position.x, item.go.position.x);
                    this.context.closePath();
                } else {
                    createImageBitmap(shape.sprite).then((image) => {
                        this.imagesCache.set((shape as SpriteShape).sprite, image);
                    });
                }
            }
        }
    }

    onSceneAtomAttached(atom: Atom) {
        let component = atom.getComponent(RenderComponent);
        if (component) {
            this.attach(component);
            component.attachEventListener('destroy', (event) => {
                this.detach(event.target as RenderComponent)
            });
        }
    }

    onSceneAtomDetached(atom: Atom) {
        this.detach(atom.getComponent(RenderComponent));
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
