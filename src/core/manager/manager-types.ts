import {Command} from "../network/commands/command";

export abstract class ManagerWithCommands {
    public abstract flushCommands(): Command[] | null;
}
