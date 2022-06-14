import {ServerCommand} from "../command";
import {Atom} from "../../../core/scene/atom";
import Serializer, {registerClass} from "../../transport/serializer";
import {AtomManager} from "../../../core/manager/atom-manager";
import {NetworkType} from "../../transport/network-type";
import {Game} from "../../../core";

@registerClass
export class DeleteAtomCommand extends ServerCommand {
    objects: Array<Atom> = [];

    static get netScheme() {
        return {
            objects: {type: NetworkType.LIST, itemType: NetworkType.REFERENCE},
        }
    };

    execute(game: Game, serializer: Serializer) {
        this.objects.forEach((obj) => obj && game.getManager(AtomManager)?.destroy(obj));
    }
}
