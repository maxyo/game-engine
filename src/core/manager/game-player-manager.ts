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
import {CollisionComponent} from "../component/collision-component";
import {BoxShape} from "../../render/shape/box-shape";

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
        let collisionComponent = player1.addComponent(CollisionComponent);

        player1.position.y = 500;
        player1.position.x = 100;

        player1.getComponent(RenderComponent).shape = new PlayerShape();
        player1.getComponent(RenderComponent).shape.toRightDir = 1;
        player1.getComponent(RenderComponent).shape.radius = 100;
        collisionComponent.shape = new CircleShape();
        collisionComponent.shape.radius = 100;

        player1.getComponent(RenderComponent).color = 'pink';

        this.game.getManager(AtomManager).spawn(player1);

        this.currentPlayer = player1.getComponent(HumanComponent);

        let player2 = new GameObject();
        player2.addComponent(RenderComponent);
        player2.addComponent(HumanComponent);
        collisionComponent = player2.addComponent(CollisionComponent);

        player2.position.y = 500;
        player2.position.x = 800;

        player2.getComponent(RenderComponent).shape = new PlayerShape();
        player2.getComponent(RenderComponent).shape.toRightDir = 0;
        player2.getComponent(RenderComponent).shape.radius = 100;
        collisionComponent.shape = new CircleShape();
        collisionComponent.shape.radius = 100;

        player2.getComponent(RenderComponent).color = 'brown';

        // this.game.getManager(AtomManager).spawn(player2);

        this.inited = true;

        this.players.push(player1.getComponent(HumanComponent));

        for (let i = 0; i < 1000; i++) {
            let ball = new GameObject();
            ball.addComponent(BallComponent);
            collisionComponent = ball.addComponent(CollisionComponent);
            ball.position.x = 200 + Math.random()*500;
            ball.position.y = 100 + Math.random()*200;
            let ballRender = ball.addComponent(RenderComponent);
            let ballShape = new CircleShape();
            ballShape.radius = 2;
            ballRender.shape = ballShape;
            ballRender.color = 'blue';
            let colors = ['blue', 'red', 'yellow', 'black', 'green', 'brown'];
            ballRender.color = colors[Math.floor(Math.random() * colors.length)];
            collisionComponent.shape = ballShape;
            this.game.getManager(AtomManager).spawn(ball);
        }

        let wallLeft = new GameObject();
        wallLeft.position.x = 0;
        wallLeft.position.y = 0;
        let wallLeftRenderComponent = wallLeft.addComponent(RenderComponent);
        wallLeftRenderComponent.color = 'green';
        let boxShape = new BoxShape();
        boxShape.height = 2000;
        boxShape.width = 50;
        wallLeftRenderComponent.shape = boxShape;
        this.game.getManager(AtomManager).spawn(wallLeft);


        let wallDown = new GameObject();
        wallDown.position.x = 0;
        wallDown.position.y = 500;
        let wallDownRenderComponent = wallDown.addComponent(RenderComponent);
        wallDownRenderComponent.color = 'green';
        boxShape = new BoxShape();
        boxShape.height = 50;
        boxShape.width = 2000;
        wallDownRenderComponent.shape = boxShape;
        this.game.getManager(AtomManager).spawn(wallDown);
    }

    public update(tpf: number) {
        for (let player of this.players) {
            player.update(tpf);
        }
    }
}
