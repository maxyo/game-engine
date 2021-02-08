import {Atom} from "../scene/atom";
import {Serializable} from "../../network/transport/serializable";
import {EventSourceTrait} from "../event/event-source-trait";
import {useTrait} from "../util/utils";
import {registerClass} from "../../network/transport/serializer";
import {NetworkType} from "../../network/transport/network-type";

export interface Component extends EventSourceTrait {
}

@registerClass
export class Component extends Serializable {
    @useTrait(EventSourceTrait) this;

    public readonly go: Atom;

    static get netScheme() {
        return {
            ...super.netScheme,
            go: {type: NetworkType.REFERENCE},
        };
    };

    public constructor(go: Atom) {
        super();
        this.go = go;
    }

    public destroy() {
        this.trigger('destroy');
    }
}
