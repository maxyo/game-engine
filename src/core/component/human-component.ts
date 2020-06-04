import {Player} from "../player";
import {Vector} from "../vector";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Component} from "./component";
import {registerClass} from "../network/transport/serializer";
import {NetworkType} from "../network/transport/network-type";
import shortid = require("shortid");

@registerClass
export class HumanComponent extends Component implements IUpdatable {
    public readonly id;
    private _player: Player;
    private _velocity: Vector = new Vector();
    private inAir: number = 1;
    private groundY = 500;
    public leftBorderX = 152.5;
    public rightBorderX = 875;

    private moveDir: number = 0;

    public get velocity() {
        return this._velocity;
    }

    public set moveDirection(value) {
        this.moveDir = Math.clamp(this.moveDir + value, -1, 1);
    }

    public static get netScheme() {
        return {
            ...super.netScheme,
            _velocity: {type: NetworkType.CLASSINSTANCE},
            inAir: {type: NetworkType.INT8},
            groundY: {type: NetworkType.FLOAT32},
            leftBorderX: {type: NetworkType.FLOAT32},
            rightBorderX: {type: NetworkType.FLOAT32},
            moveDir: {type: NetworkType.INT8},
        }
    }

    static get rpcMethods() {
        return [
            'jump'
        ];
    }

    public update(tick_lag: number) {
        this._velocity.y = Math.lerp(this._velocity.y, 0, 0.1);
        this._velocity.x = Math.lerp(this._velocity.x, 0, 0.2);
        if (this.inAir == 1) {
            this._velocity.y += 1;
            if (this.go.position.y > this.groundY) {
                this.go.position.y = this.groundY;
                this._velocity.y = 0;
                this.inAir = 0;
            }
        }

        this.moveDir = Math.clamp(this.moveDir, -1, 1);

        this._velocity.x += this.moveDir;

        if (this.leftBorderX > this.go.position.x) {
            this._velocity.x = Math.max(this._velocity.x, 0);
        }

        if (this.rightBorderX < this.go.position.x) {
            this._velocity.x = Math.min(this._velocity.x, 0);
        }

        this.go.position.add(this._velocity);

        if (this.go.position.y > this.groundY) {
            this.go.position.y = this.groundY;
            this._velocity.y = 0;
            this.inAir = 0;
        }
    }

    public jump() {
        if (this.inAir == 1) {
            return;
        }
        this._velocity.y -= 20;
        this.inAir = 1;
    }
}
