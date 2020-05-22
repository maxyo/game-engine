import {GameObject} from "../scene/atom/game-object/game-object";
import {RenderComponent} from "../../render/component/render-component";
import {HumanComponent} from "../component/human-component";
import {PlayerShape} from "../../render/shape/player-shape";
import {AtomManager} from "./atom-manager";
import {Manager} from "./manager";
import {InputManager} from "./input-manager";
import {IUpdatableManager} from "./manager-types";
import {CircleShape} from "../../render/shape/circle-shape";
import {BallComponent} from "../component/ball-component";

export class GamePlayerManager extends Manager implements IUpdatableManager {

    private inited: boolean = false;
    private currentPlayer: HumanComponent;
    private players: HumanComponent[] = [];

    public init() {
        this.game.getManager(InputManager).attachEventListener('keydown', (event) => {
            if (event.data[0] === "Space") {
                if (!this.inited) {
                    this.initPlayers();
                } else {
                    this.currentPlayer.jump();
                }
            }
            if (event.data[0] === 'ArrowLeft') {
                this.currentPlayer.startMoveLeft();
            }

            if (event.data[0] === 'ArrowRight') {
                this.currentPlayer.startMoveRight();
            }
        });

        this.game.getManager(InputManager).attachEventListener('keyup', (event) => {
            if (event.data[0] === "Space") {
                if (!this.inited) {
                    this.initPlayers();
                } else {
                    this.currentPlayer.jump();
                }
            }
            if (event.data[0] === 'ArrowLeft') {
                this.currentPlayer.stopMoveLeft();
            }

            if (event.data[0] === 'ArrowRight') {
                this.currentPlayer.stopMoveRight();
            }
        });
    }

    public initPlayers() {
        if (this.inited) {
            return;
        }

        let player1 = new GameObject();
        player1.addComponent(RenderComponent);
        player1.addComponent(HumanComponent);

        player1.position.y = 500;
        player1.position.x = 100;

        player1.getComponent(RenderComponent).shape = new PlayerShape();
        player1.getComponent(RenderComponent).shape.toRightDir = 1;
        player1.getComponent(RenderComponent).shape.radius = 100;

        player1.getComponent(RenderComponent).color = 'pink';

        this.game.getManager(AtomManager).spawn(player1);

        this.currentPlayer = player1.getComponent(HumanComponent);

        let player2 = new GameObject();
        player2.addComponent(RenderComponent);
        player2.addComponent(HumanComponent);

        player2.position.y = 500;
        player2.position.x = 800;

        player2.getComponent(RenderComponent).shape = new PlayerShape();
        player2.getComponent(RenderComponent).shape.toRightDir = 0;
        player2.getComponent(RenderComponent).shape.radius = 100;

        player2.getComponent(RenderComponent).color = 'brown';

        this.game.getManager(AtomManager).spawn(player2);

        this.inited = true;

        this.players.push(player1.getComponent(HumanComponent), player2.getComponent(HumanComponent));

        let ball = new GameObject();
        ball.addComponent(BallComponent);
        ball.position.x  = 100;
        ball.position.y = 500;
        let ballRender = ball.addComponent(RenderComponent);
        let ballShape = new CircleShape();
        ballShape.radius = 20;
        ballRender.shape = ballShape;
        ballRender.color = 'yellow';
        this.game.getManager(AtomManager).spawn(ball);
    }

    public update(tpf: number) {
        for (let player of this.players) {
            player.update(tpf);
        }
    }
}
