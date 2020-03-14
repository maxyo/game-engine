/**
 * Интерфейс
 */

export abstract class Transportable {
    private static fields = [];

    public toArray(fields?: string[]) {
        if (!fields) {
            fields = Object.getPrototypeOf(this).fields;
        }
        let result = [];
        for (let field in fields) {
            result.push(this[field]);
        }
        result['type'] = this.constructor.name;

        return result;
    }

    public needToSync() {
        return true;
    }

    static sync(target: Transportable, property) {
        if (!Object.getPrototypeOf(target).fields) {
            Object.getPrototypeOf(target).fields = [];
        }
        Object.getPrototypeOf(target).fields.push(property);
    }
}

// Алиас для Transportable.sync
export function sync(target: Transportable, property) {
    Transportable.sync(target, property);
}
