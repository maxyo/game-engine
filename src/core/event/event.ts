export class Event {
    public readonly time: number;
    public readonly target: object;
    public readonly data: any;

    constructor(target: object, data) {
        this.time = Date.now();
        this.target = target;
        this.data = data;
    }
}
