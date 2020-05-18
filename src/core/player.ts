import {Serializable} from "./network/transport/serializable";
import {NetworkType} from "./network/transport/network-type";
import {InputAction, InputActionType} from "./input/input-action";
import {EventSourceTrait} from "./event/event-source-trait";
import {use} from "typescript-mix";
import {registerClass} from "./network/transport/serializer";

export interface Player extends EventSourceTrait {

}

@registerClass
export class Player extends Serializable {
    @use(EventSourceTrait) this;

    readonly id: number;
    readonly nickname: string;

    static get netScheme() {
        return {
            id: {type: NetworkType.UINT8},
            nickname: {type: NetworkType.STRING},
        };
    }

    public constructor(properties = {}) {
        super(properties);
    }

    public emitInput(action: InputAction) {
        switch (action.type) {
            case InputActionType.CLICK:
                this.trigger('click', action);
                break;
            case InputActionType.DBLCLICK:
                this.trigger('dblclick', action);
                break;
            case InputActionType.KEYDOWN:
                this.trigger('keydown', action);
                break;
            case InputActionType.KEYUP:
                this.trigger('keyup', action);
                break;
        }
    }
}