export function sleep(ms = 0) {
    if (ms === 0) {
        return;
    }
    return new Promise(r => setTimeout(r, ms));
}

export function isUpdatable(object: any) {
    return object.update !== undefined;
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
        });
    });
}
