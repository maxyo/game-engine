export abstract class Transportable {
    private static fields = [];

    public toArray(fields?: string[]) {
        if (!fields) {
            fields = Object.getPrototypeOf(this).fields;
        }
        let result = {};
        for (let field of fields) {
            result[field] = this.toPrimitiveField(field);
        }
        result['__type__'] = this.constructor.name;

        console.log(result);
        return result;
    }

    protected toPrimitiveField(fieldName): any {
        return this.toPrimitive(this[fieldName]);
    }

    private toPrimitive(field) {
        if (field instanceof Transportable) {
            return field.toArray();
        } else if (field instanceof Array) {
            return field.map(val => this.toPrimitive(val));
        } else {
            return field;
        }
    }

    public needToSync() {
        return true;
    }

    public static parse(data: Array<any>) {

    }

    static sync(target, property) {
        if (!target.fields) {
            target.fields = [];
        }
        target.fields.push(property);
    }
}

export const CONSTRUCTORS: Map<string, Function> = new Map<string, Function>();

// Алиас для Transportable.sync
export function sync(target, property) {
    Transportable.sync(target, property);
}

export function transportable(constructor: Function) {
    CONSTRUCTORS.set(constructor.name, constructor);
}
