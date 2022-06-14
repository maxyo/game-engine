import {Command} from "../../network/command/command";
import {Client} from "../../network/client/client";

export interface ISelectiveNetworkManager {
    getCommandsForClient(client: Client): Promise<Command[] | undefined>;
}

export interface INetworkManager {
    getCommands(): Promise<Command[] | undefined>;
}

export interface IUpdatableManager {
    update(tpf: number): Promise<void>;
}

export function isNetworkManager(manager: any): manager is INetworkManager {
    return manager.getCommands !== undefined;
}

export function isSelectiveNetworkManager(manager: any): manager is ISelectiveNetworkManager {
    return manager.getCommandsForClient !== undefined;
}

export function isUpdatableManager(manager: any): manager is IUpdatableManager {
    return manager.update !== undefined;
}

