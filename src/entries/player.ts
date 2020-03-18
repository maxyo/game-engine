import {CreateAtomCommand} from "../core/network/commands/create-atom-command";
import {GameObject} from "../core/scene/atom/game-object/game-object";

let command = new CreateAtomCommand();

command.objects.push(new GameObject('asdasd'));
let serialized = command.serialize();

let newCommand = CreateAtomCommand.unserialize(serialized);
console.log(newCommand);
