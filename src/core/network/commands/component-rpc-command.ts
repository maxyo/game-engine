import {ServerCommand} from "./command";
import Serializer, {registerClass} from "../transport/serializer";
import {Game} from "../../game";
import {NetworkType} from "../transport/network-type";
import {Serializable} from "../transport/serializable";

@registerClass
export class ComponentRpcCommand extends ServerCommand {
    target: Serializable;
    functionKey: number;

    public static get netScheme() {
        return {
            target: {type: NetworkType.REFERENCE},
            functionKey: {type: NetworkType.UINT8}
        };
    }

    execute(game: Game, serializer: Serializer) {
        this.target[this.target.constructor['rpcMethods'][this.functionKey]]();
    }

}