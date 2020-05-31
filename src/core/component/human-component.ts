import {Player} from "../player";
import {Vector} from "../vector";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Component} from "./component";
import {registerClass} from "../network/transport/serializer";
import {NetworkType} from "../network/transport/network-type";

@registerClass
export class HumanComponent extends Component implements IUpdatable {
    private _player: Player;
    private _velocity: Vector = new Vector();
    private inAir: number = 1;
    private groundY = 500;
    public leftBorderX = 150;
    public rightBorderX = 1000;

    private moveDir: number = 0;

    public get velocity() {
        return this._velocity;
    }

    public static get netScheme() {
        return {
            velocity: {type: NetworkType.CLASSINSTANCE},
            inAir: {type: NetworkType.INT8},
            groundY: {type: NetworkType.FLOAT32},
        }
    }

    static get rpcMethods() {
        return [
            'jump'
        ];
    }

    public set player(value: Player) {
        this._player = value;
        this.player.attachEventListener('keydown', (event) => {
            this.onKeyDown(event);
        })
    }

    private onKeyDown(event) {
        this.jump();
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

    public startMoveRight() {
        this.moveDir = Math.min(this.moveDir + 1, 1);
    }

    public startMoveLeft() {
        this.moveDir = Math.max(this.moveDir - 1, -1);
    }

    public stopMoveLeft() {
        this.moveDir = Math.min(this.moveDir + 1, 1);
    }

    public stopMoveRight() {
        this.moveDir = Math.max(this.moveDir - 1, -1);
    }
}
