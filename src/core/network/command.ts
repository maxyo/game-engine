import {Game} from "../game";
import {CONSTRUCTORS, Transportable} from "./transport/transportable";


export abstract class Command extends Transportable {
    abstract execute(game: Game);

    serialize(): string {
        return this.pack(this.toArray(['objects']));
    }

    public static unserialize(data: string) {
        return this.parseItem(this.unpack(data));
    }

    public static parseItem(item: []) {
        let itemType = CONSTRUCTORS.get(item['__type__']);
        if (!itemType || !(itemType instanceof Function)) {
            throw new Error('Unexpected type');
        }
        let result = Reflect.construct(itemType, []);
        for (let [key, value] of Object.entries(item)) {
            if (value['__type__']) {
                result[key] = this.parseItem(value);
            } else if (key !== '__type__') {
                result[key] = value;
            }
        }

        console.log(result);

        return result;
    }

    protected pack(data: any) {
        return JSON.stringify(data);
    }

    protected static unpack(data: any) {
        return JSON.parse(data);
    }
}
