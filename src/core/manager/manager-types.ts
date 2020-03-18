import {Command} from "../network/command";

export interface INetworkManager {
    flushCommands(): Command[] | null;
}

export interface IUpdatableManager {
    update(tpf: number);
}

export function isNetworkManager(manager: any): boolean {
    return manager.flushCommands !== undefined;
}

export function isUpdatableManager(manager: any): boolean {
    return manager.update !== undefined;
}

