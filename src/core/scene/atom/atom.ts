import {SpriteResource} from '../../resources/sprite-resource';
import {sync, Transportable} from '../../network/transport/transportable';
import {Component} from "../../component/component";
import {Vector} from '../../vector';

let LATEST_ID = 0;

/**
 * Базовый игровой объект
 */

export abstract class Atom extends Transportable{
    @sync id: number;

    @sync name: string;
    @sync sprite: SpriteResource;

    @sync position: Vector = new Vector;

    @sync private components: Component[] = [];

    protected constructor(name = '') {
        super();
        this.id = LATEST_ID++;
        this.name = name;
        this.sprite = new SpriteResource();
    }

    public init() {
        this.onInit();
    }

    public destroy() {
        this.onDestroy();
        // this.manager.detach(this);
        // delete this;
    }

    protected onInit() {
    }

    protected onDestroy() {
    }

    public addComponent(type) {
        this.components.push(new type(this));
    }

    public getComponent(type: typeof Component) {
        for (let component of this.components) {
            if (component instanceof type) {
                return component;
            }
        }
    }
}



