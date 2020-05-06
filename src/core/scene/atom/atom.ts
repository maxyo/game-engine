import {Serializable} from '../../network/transport/serializable';
import {Component} from "../../component/component";
import {Vector} from '../../vector';
import {useTrait} from "../../util/functions";
import {EventSourceTrait} from "../../event/event-source-trait";
import {registerClass} from "../../network/transport/serializer";
import {NetworkType} from "../../network/transport/network-type";

/**
 * Базовый игровой объект
 */

@registerClass
export abstract class Atom extends Serializable {
    @useTrait(EventSourceTrait)

    public name: string;

    public readonly position: Vector = new Vector;

    public readonly components: Component[] = [];

    static get netScheme() {
        return {
            ...super.netScheme,
            name: {type: NetworkType.STRING},
            position: {type: NetworkType.CLASSINSTANCE},
            components: {type: NetworkType.LIST, itemType: NetworkType.CLASSINSTANCE}
        };
    };

    protected constructor(name = '') {
        super();
        this.name = name;
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

    public addComponent<T extends Component>(type: { new(go: Atom): T; }): T {
        let comp = new type(this);
        this.components.push(comp);
        return comp;
    }

    public getComponent<T extends Component>(type: { new(go: Atom): T; }): T {
        for (let component of this.components) {
            if (component instanceof type) {
                return component as T;
            }
        }
    }
}



