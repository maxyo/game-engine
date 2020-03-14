import {encode} from "msgpack";
import {Game} from "../../game";
import {ActionCommand} from "./action-command";


export abstract class Command {
    abstract execute(game: Game);

    public serialize(): Buffer {
        return encode(this);
    }

    public static unserialize(data: Buffer) {
        return new ActionCommand("asd", "ASd");
    }
}
