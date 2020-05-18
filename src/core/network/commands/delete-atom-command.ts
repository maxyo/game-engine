import {ServerCommand} from "./command";
import {Atom} from "../../scene/atom/atom";
import {Game} from "src/core/game";
import Serializer, {registerClass} from "../transport/serializer";
import {AtomManager} from "../../manager/atom-manager";
import {NetworkType} from "../transport/network-type";

@registerClass
export class DeleteAtomCommand extends ServerCommand {
    objects: Array<Atom> = [];

    static get netScheme() {
        return {
            objects: {type: NetworkType.LIST, itemType: NetworkType.REFERENCE},
        }
    };

    execute(game: Game, serializer: Serializer) {
        this.objects.forEach((obj) => obj && game.getManager(AtomManager).destroy(obj));
    }
}
