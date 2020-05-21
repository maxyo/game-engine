import {ClientCommand} from "./command";
import {Game} from "../../game";
import Serializer, {registerClass} from "../transport/serializer";
import {Client} from "../client/client";
import {GameObject} from "../../scene/atom/game-object/game-object";
import {LogicComponent} from "../../component/logic-component";
import {AtomManager} from "../../manager/atom-manager";
import {NetworkType} from "../transport/network-type";
import {Vector} from "../../vector";
import {RenderComponent} from "../../../render/component/render-component";
import {BoxShape} from "../../../render/shape/box-shape";

@registerClass
export class SpawnBoxCommand extends ClientCommand {
    private x: number;
    private y: number;

    public static get netScheme() {
        return {
            x: {type: NetworkType.FLOAT32},
            y: {type: NetworkType.FLOAT32},
        };
    }

    execute(game: Game, serializer: Serializer, client: Client) {
        let box = new GameObject();
        let render = box.addComponent(RenderComponent);
        render.shape = new BoxShape({width: (Math.random()-Math.random())*100, height: (Math.random()-Math.random())*100});
        box.addComponent(LogicComponent);
        box.position.add(new Vector(this.x, this.y));
        game.getManager(AtomManager).spawn(box);
    }
}