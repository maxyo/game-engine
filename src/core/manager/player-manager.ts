import {Manager} from "./manager";
import {INetworkManager} from "./manager-types";
import {Command} from "../../network/command/command";
import {Player} from "../player";
import {InitPlayerCommand} from "../../network/command/init-player-command";

export class PlayerManager extends Manager implements INetworkManager {
    private commands: Command[] = [];

    registerPlayer(player: Player) {
        this.game.attachPlayer(player);
        this.commands.push(new InitPlayerCommand(player));
    }

    getCommands(): Command[] | null {
        if (this.commands.length != 0) {
            let result = this.commands;
            this.commands = [];
            return result;
        }
        return null;
    }

}