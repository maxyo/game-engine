export abstract class IUpdatable {
    public abstract update(tick_lag: number): void;
}

export function isUpdatable(obj: any) {
    return obj.update !== undefined;
}