import * as msgpack from "msgpack";


export abstract class Command {
    abstract execute();

    public serialize(): Buffer {
        return msgpack.encode(this);
    }
}
