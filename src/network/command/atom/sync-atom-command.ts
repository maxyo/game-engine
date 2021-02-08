import {Atom} from "../../../core/scene/atom";
import {ServerCommand} from "../command";
import {Game} from "src/core/game";
import {registerClass} from "../../transport/serializer";
import {NetworkType} from "../../transport/network-type";

@registerClass
export class SyncAtomCommand extends ServerCommand {
    objects: Array<Atom> = [];

    static get netScheme() {
        return {
            ...super.netScheme,
            objects: {type: NetworkType.LIST, itemType: NetworkType.SERIALIZABLE_OBJECT},
        }
    };

    execute(game: Game, serializer) {
        this.objects.map((obj) => {
            serializer.networkObjects.get(obj.id).syncTo(obj);
        });
    }
}
