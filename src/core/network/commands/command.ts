import {pack} from "msgpack";
import {Game} from "../../game";


export abstract class Command {
    public abstract execute(game: Game);

    public serialize(): Buffer {
        return pack(this);
    }
}