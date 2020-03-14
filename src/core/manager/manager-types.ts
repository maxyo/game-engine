import {Command} from "../network/commands/command";

export interface ManagerWithCommands {
    flushCommands(): Command[] | null;
}
