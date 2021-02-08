import {Atom} from "../../../core/scene/atom";
import {ServerCommand} from "../command";
import {Game} from "src/core/game";
import {NetworkType} from "../../transport/network-type";
import {registerClass} from "../../transport/serializer";

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
        console.log(this.objects);
    }
}
