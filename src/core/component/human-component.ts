import {Player} from "../player";
import {Vector} from "../vector";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Component} from "./component";
import {registerClass} from "../network/transport/serializer";
import {NetworkType} from "../network/transport/network-type";

@registerClass
export class HumanComponent extends Component implements IUpdatable {
    private _player: Player;
    private velocity: Vector = new Vector();
    private inAir: number = 1;
    private groundY = 1000;
    public leftBorderX = 100;
    public rightBorderX = 500;

    private moveDir: number = 0;

    public get netScheme() {
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
        this.velocity.y = Math.lerp(this.velocity.y, 0, 0.1);
        this.velocity.x = Math.lerp(this.velocity.x, 0, 0.1);
        if (this.inAir == 1) {
            this.velocity.y += 1;
            if (this.go.position.y > this.groundY) {
                this.go.position.y = this.groundY;
                this.velocity.y = 0;
                this.inAir = 0;
            }
        }

        this.moveDir = Math.clamp(this.moveDir, -1, 1);

        this.velocity.x += 0.5*this.moveDir;

        if(this.leftBorderX > this.go.position.x) {
            this.velocity.x = Math.max(this.velocity.x, 0);
        }

        if(this.rightBorderX < this.go.position.x) {
            this.velocity.x = Math.min(this.velocity.x, 0);
        }

        this.go.position.add(this.velocity);
    }

    public jump() {
        if (this.inAir == 1) {
            return;
        }
        this.velocity.y -= 10;
        this.inAir = 1;
    }

    public startMoveRight() {
        this.moveDir += 1;
    }

    public startMoveLeft() {
        this.moveDir -= 1;
    }

    public stopMoveLeft() {
        this.moveDir += 1;
    }

    public stopMoveRight() {
        this.moveDir -= 1;
    }
}
