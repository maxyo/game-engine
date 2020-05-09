import {Atom} from "../../scene/atom/atom";
import {Command} from "../command";
import {Game} from "src/core/game";
import {registerClass} from "../transport/serializer";
import {NetworkType} from "../transport/network-type";

@registerClass
export class SyncAtomCommand extends Command {
    objects: Array<Atom> = [];

    static get netScheme() {
        return {
            ...super.netScheme,
            objects: {type: NetworkType.LIST, itemType: NetworkType.CLASSINSTANCE},
        }
    };

    execute(game: Game, serializer) {
        this.objects.map((obj) => {
            serializer.networkObjects.get(obj.id).syncTo(obj);
        });
    }
}
