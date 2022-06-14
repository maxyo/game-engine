import {Atom} from "../../../core/scene/atom";
import {ServerCommand} from "../command";
import {NetworkType} from "../../transport/network-type";
import {registerClass} from "../../transport/serializer";
import {Game} from "../../../core";

@registerClass
export class CreateAtomCommand extends ServerCommand {
    objects: Atom[] = [];

    static get netScheme() {
        return {
            objects: {type: NetworkType.LIST, itemType: NetworkType.SERIALIZABLE_OBJECT},
        }
    };

    execute(game: Game) {
        this.objects.forEach((atom: Atom) => game.getScene().attach(atom));
    }
}

