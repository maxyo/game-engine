import {Manager} from "./manager";
import {ISelectiveNetworkManager} from "./manager-types";
import {Command} from "../../network/command/command";
import {Client} from "../../network/client/client";
import {ComponentRpcCommand} from "../../network/command/component-rpc-command";
import {Component} from "../component/component";

export class RpcManager extends Manager implements ISelectiveNetworkManager {

    private commands: Map<Client, ComponentRpcCommand[]> = new Map<Client, ComponentRpcCommand[]>();

    private allCommands: ComponentRpcCommand[] = [];

    public callOnComponent(client: Client, target: Component, functionName: string) {
        let command = new ComponentRpcCommand({
            target: target,
            functionKey: target.constructor['rpcMethods'].indexOf(functionName)
        });
        this.allCommands.push(command)
        // if (this.command.has(client)) {
        //     this.command.get(client).push(command);
        // } else {
        //     this.command.set(client, [command]);
        // }
    }

    getCommandsForClient(client: Client): Command[] | null {
        // if (this.command.has(client)) {
        //     let result = this.command.get(client);
        //     this.command.set(client, []);
        //     return result;
        // }
        // return null;

        if( this.allCommands.length != 0) {
            let result = this.allCommands;
            this.allCommands = [];
            return result;
        }
    }

}