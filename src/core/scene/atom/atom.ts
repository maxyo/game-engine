import {Serializable} from '../../network/transport/serializable';
import {Component} from "../../component/component";
import {Vector} from '../../math/vector';
import {useTrait} from "../../util/functions";
import {EventSourceTrait} from "../../event/event-source-trait";
import {registerClass} from "../../network/transport/serializer";
import {NetworkType} from "../../network/transport/network-type";
import shortid = require("shortid");

/**
 * Базовый игровой объект
 */

export interface Atom extends Serializable, EventSourceTrait{

}

@registerClass
export abstract class Atom extends Serializable {
    @useTrait(EventSourceTrait)

    public readonly id;


    public readonly position: Vector = new Vector;
    public readonly scale: Vector = new Vector(1, 1, 1);
    public readonly rotation: Vector = new Vector(0,0,1);
    public readonly components: Component[] = [];

    static get netScheme() {
        return {
            id: {type: NetworkType.STRING},
            position: {type: NetworkType.CLASSINSTANCE},
            components: {type: NetworkType.LIST, itemType: NetworkType.CLASSINSTANCE},
            scale: {type: NetworkType.CLASSINSTANCE},
            rotation: {type: NetworkType.CLASSINSTANCE},
        };
    };

    public constructor(properties = {}) {
        super(properties);

        if (!this.id) {
            this.id = shortid();
        }

        this.init();
    }

    public init() {
        this.onInit();
    }

    public destroy() {
        this.onDestroy();
    }

    protected onInit() {
    }

    protected onDestroy() {
    }

    public addComponent<T extends Component>(type: { new(go: Atom): T; }): T {
        let comp = new type(this);
        this.components.push(comp);
        this.trigger('componentAdd', comp)
        return comp;
    }

    public getComponent<T extends Component>(type: { new(go: Atom): T; }): T {
        for (let component of this.components) {
            if (component instanceof type) {
                return component as T;
            }
        }
    }

    public removeComponent<T extends Component>(type: { new(go: Atom): T; }): T {
        for (let component of this.components) {
            if (component instanceof type) {
                this.components.unshift(component);
                this.trigger('componentRemove', component)
                return component;
            }
        }
    }
}



