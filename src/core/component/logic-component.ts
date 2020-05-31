import {registerClass} from "../network/transport/serializer";
import {Atom} from "../scene/atom/atom";
import {Component} from "./component";
import {RIGHT, Vector} from "../vector";
import {Game, GameMode} from "../game";
import {RenderComponent} from "../../render/component/render-component";
import {NetworkType} from "../network/transport/network-type";
import shortid = require("shortid");
import {Serializable} from "../network/transport/serializable";

@registerClass
export class LogicComponent extends Component {

    public static get netScheme() {
        return {
            id: {type: NetworkType.STRING},
            ...super.netScheme,
        };
    }

    public static get rpcMethods() {
        return [
            'randomColor',
        ];
    }

    public readonly id;

    public constructor(go: Atom) {
        super(go);

        if (!this.id) {
            this.id = shortid();
        }
    }

    public update(tpf: number) {
        if(Game.instance.isServer) {
            if (this.go.position.y > 2000) {
                this.go.position.y = -10;
            } else {
                this.go.position.y += 5;
            }
        }
    }

    public randomColor() {
            let colors = ['blue', 'red', 'yellow', 'black', 'green', 'brown'];
            this.go.getComponent(RenderComponent).color = colors[Math.floor(Math.random() * colors.length)];
    }
}
