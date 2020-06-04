import {Atom} from "../scene/atom/atom";
import {Serializable} from "../network/transport/serializable";
import {EventSourceTrait} from "../event/event-source-trait";
import {useTrait} from "../util/functions";
import {registerClass} from "../network/transport/serializer";
import {NetworkType} from "../network/transport/network-type";
import shortid = require("shortid");

export interface Component extends EventSourceTrait {
}

@registerClass
export class Component extends Serializable {
    @useTrait(EventSourceTrait) this;

    public readonly go: Atom;
    public readonly id;


    static get netScheme() {
        return {
            id: {type: NetworkType.STRING},
            go: {type: NetworkType.REFERENCE},
        };
    };

    public constructor(go: Atom) {
        super();

        if (!this.id) {
            this.id = shortid();
        }

        this.go = go;
    }

    public destroy() {
        this.trigger('destroy');
    }
}
