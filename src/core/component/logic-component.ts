import {registerClass} from "../network/transport/serializer";
import {Atom} from "../scene/atom/atom";
import {Component} from "./component";
import {RIGHT, Vector} from "../vector";
import {Game, GameMode} from "../game";
import {RenderComponent} from "./render-component";

@registerClass
export class LogicComponent extends Component {

    public constructor(go: Atom) {
        super(go);
    }

    public update(tpf: number) {
        if (Game.instance.gameMode == GameMode.Front) {
            let colors = ['blue', 'red', 'yellow', 'black', 'green', 'brown'];
            this.go.getComponent(RenderComponent).color = colors[Math.floor(Math.random() * colors.length)];;
        } else {
            this.go.position.add(RIGHT);
        }
    }
}
