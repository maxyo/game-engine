import {Serializable} from '../../network/transport/serializable';
import {Component} from "../component/component";
import {Vector} from '../math/vector';
import {useTrait} from "../util/utils";
import {EventSourceTrait} from "../event/event-source-trait";
import {registerClass} from "../../network/transport/serializer";
import {NetworkType} from "../../network/transport/network-type";
import shortid = require("shortid");
import {Transform} from "./transform";

/**
 * Базовый игровой объект
 */

export interface Atom extends Serializable, EventSourceTrait {

}

@registerClass
export class Atom extends Serializable {
    @useTrait(EventSourceTrait)

    public readonly id;

    public readonly components: Component[] = [];

    public readonly transform: Transform;

    private _initialized: boolean = false;

    public get initialized() {
        return this._initialized;
    }

    static get netScheme() {
        return {
            id: {type: NetworkType.STRING},
            position: {type: NetworkType.SERIALIZABLE_OBJECT},
            components: {type: NetworkType.LIST, itemType: NetworkType.SERIALIZABLE_OBJECT},
            scale: {type: NetworkType.SERIALIZABLE_OBJECT},
            rotation: {type: NetworkType.SERIALIZABLE_OBJECT},
        };
    };

    public constructor(properties = {}) {
        super(properties);

        if (!this.id) {
            this.id = shortid();
        }

        if (!this.transform) {
            this.transform = new Transform();
        }
    }

    public init() {
        this._initialized = true;

        this.trigger('initialized');
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



