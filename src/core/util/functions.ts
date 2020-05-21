import {use as useExternal} from "typescript-mix";

export class Tree<K, V> {
    key: K;
    value: V;
    leaves: Tree<K, V>[] = [];
    root: Tree<K, V>;

    constructor(key: K = null, value: V = null, root: Tree<K, V> = null) {
        this.key = key;
        this.value = value;
    }

    public attach(key: K, value: V) {
        let newContainer = new Tree<K, V>(key, value, this);
        this.leaves.push(newContainer);
        return newContainer;
    }

    public isChildOf(childKey: K, parentKey: K): boolean {
        let container = this.find(parentKey);
        return container && container.find(childKey) != null;
    }

    public getAllChildren(parentKey: K): Map<K, V> {
        let result = new Map<K, V>();
        let parentLeave = this.find(parentKey);
        parentLeave.recursiveGetAll(result);
        return result;
    }

    public getPath(parentKey: K, childrenKey: K) {
        let parentLeave = this.find(parentKey);

        parentLeave.find(childrenKey);
    }

    public forEachRecursive(callback: (leave: Tree<K, V>, path: Tree<K, V>[]) => void, path: Tree<K, V>[] = []) {
        callback(this, path);
        path.push(this);
        for (let leave of this.leaves) {
            leave.forEachRecursive(callback, path);
        }
        path.pop();
    }

    private recursiveGetAll(result: Map<K, V> = new Map<K, V>()) {
        result.set(this.key, this.value);
        for (let subLeave of this.leaves) {
            subLeave.recursiveGetAll(result);
        }
    }

    public find(key: K, path: Map<K, V> = new Map<K, V>()): Tree<K, V> {
        for (let leave of this.leaves) {
            if (leave.key === key) {
                return leave;
            }
        }

        for (let leave of this.leaves) {
            let container = leave.find(key, path);
            if (container) {
                return container;
            }
        }
        return null;
    }
}


export function useTrait(...options: Function[]): (target: any, propertyKey: string) => void {
    return function (target, propertyKey) {
        useExternal(...options)(target, propertyKey);
    };
}

export function sleep(ms = 0) {
    if (ms === 0) {
        return;
    }
    return new Promise(r => setTimeout(r, ms));
}

export function isUpdatable(object: any) {
    return object.update !== undefined;
}

export function distinctFilter(value, index, self) {
    return self.indexOf(value) === index;
}

export function hashStr(str, bits = null) {
    let hash = 532;
    let i = str.length;
    bits = bits ? bits : 8;

    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    hash = hash >>> 0;
    hash = hash % (Math.pow(2, bits) - 1);

    return hash;
}

declare global {
    interface Array<T> {
        remove(element: T): void;
    }
}
Array.prototype.remove = (el: any) => {
    delete this[this.indexOf(el)];
}