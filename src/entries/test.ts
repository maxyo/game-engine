import {GameObject} from "../core/scene/atom/game-object/game-object";
import Serializer from "../core/network/transport/serializer";
import {hashStr} from "../core/util/functions";
import {CreateAtomCommand} from "../core/network/commands/create-atom-command";
import {RenderComponent} from "../core/component/render-component";
import { Component } from "../core/component/component";

let go = new GameObject();
let comp = go.addComponent(RenderComponent);
go.scale.add(123);
let serializer = new Serializer();
serializer.loadClasses();
// console.log(go.serialize(serializer));

let command = new CreateAtomCommand();
command.objects.push(go);

let data = command.serialize(serializer);
// console.log(data);
// console.log(serializer.deserialize(data.dataBuffer, 0));
command = serializer.deserialize(data.dataBuffer,0).obj;
console.log(command.objects[0]);

command.objects[0].components[0].go.position.add(1);
console.log(go);
