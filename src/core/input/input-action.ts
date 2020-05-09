import {NetworkType} from "../network/transport/network-type";
import {registerClass} from "../network/transport/serializer";
import {Serializable} from "../network/transport/serializable";
import {registerCommand} from "../network/command";

@registerClass
export class InputAction extends Serializable {
    type: InputActionType;

    static get netScheme() {
        return {
            type: {type: NetworkType.UINT8},
        }
    }
}

@registerClass
export class ClickInputAction extends InputAction {
    x: number;
    y: number;

    type = InputActionType.CLICK;

    static get netScheme() {
        return {
            ...super.netScheme,
            x: {type: NetworkType.FLOAT32},
            y: {type: NetworkType.FLOAT32},

        }
    }
}

export enum InputActionType {
    CLICK,
    DBLCLICK,
    KEYDOWN,
    KEYUP,
}

export enum InputActionKey {

}

