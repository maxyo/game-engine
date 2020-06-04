import {GameObject} from "../scene/atom/game-object/game-object";
import {RenderComponent} from "../../render/component/render-component";
import {HumanComponent} from "../component/human-component";
import {PlayerShape} from "../../render/shape/player-shape";
import {AtomManager} from "./atom-manager";
import {Manager} from "./manager";
import {InputManager} from "./input-manager";
import {INetworkManager, IUpdatableManager} from "./manager-types";
import {CircleShape} from "../../render/shape/circle-shape";
import {BallComponent} from "../component/ball-component";
import {CollisionComponent} from "../component/collision-component";
import {BoxShape} from "../../render/shape/box-shape";
import {ClientCommand, Command} from "../network/commands/command";
import {StartGameCommand} from "../network/commands/start-game-command";
import {Client} from "../network/client/client";
import {RpcManager} from "./rpc-manager";
import {JumpCommand} from "../network/commands/jump-command";
import {MoveCommand} from "../network/commands/move-command";
import {setToHuman} from "../network/commands/set-to-human";

export class GamePlayerManager extends Manager implements IUpdatableManager, INetworkManager {

    private inited: boolean = false;
    private currentPlayer: HumanComponent;
    private allPlayers: HumanComponent[] = [];
    private freeMan: HumanComponent[] = [];
    private commands: ClientCommand[] = [];
    private playerAttached: WeakMap<Client, HumanComponent> = new WeakMap<Client, HumanComponent>();
    private notAttachedClients = [];

    public init() {
        if (!this.game.isServer) {
            this.game.getManager(InputManager).attachEventListener('keydown', (event) => {
                if (event.data[0] === "Space") {
                    if (!this.currentPlayer) {
                        this.commands.push(new StartGameCommand())
                    } else {
                        this.currentPlayer.jump();
                        this.commands.push(new JumpCommand())
                    }
                }
                if (event.data[0] === 'ArrowLeft') {
                    this.currentPlayer.moveDirection = -1;
                    this.commands.push(new MoveCommand(-1));
                }

                if (event.data[0] === 'ArrowRight') {
                    this.currentPlayer.moveDirection = 1;
                    this.commands.push(new MoveCommand(1));
                }
            });

            this.game.getManager(InputManager).attachEventListener('keyup', (event) => {
                if (event.data[0] === 'ArrowLeft') {
                    this.currentPlayer.moveDirection = 1;
                    this.commands.push(new MoveCommand(1));
                }

                if (event.data[0] === 'ArrowRight') {
                    this.currentPlayer.moveDirection = -1;
                    this.commands.push(new MoveCommand(-1));
                }
            });
        } else {
            this.game.transport.attachEventListener('connect', (event) => {
                let client = event.data[0];
                if (this.inited) {
                    this.attachToPlayer(client);
                    this.game.networkService.pushCommands([new setToHuman({
                        human: this.playerAttached.get(client),
                        client: client
                    })]);
                } else {
                    this.notAttachedClients.push(client);
                }
            })
        }
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
        (player1.getComponent(RenderComponent).shape as PlayerShape).toRightDir = 1;
        (player1.getComponent(RenderComponent).shape as PlayerShape).radius = 100;
        collisionComponent.shape = new CircleShape();
        (collisionComponent.shape as CircleShape).radius = 100;

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
        (player2.getComponent(RenderComponent).shape as PlayerShape).toRightDir = 0;
        (player2.getComponent(RenderComponent).shape as PlayerShape).radius = 100;
        collisionComponent.shape = new CircleShape();
        (collisionComponent.shape as CircleShape).radius = 100;

        player2.getComponent(RenderComponent).color = 'brown';

        this.game.getManager(AtomManager).spawn(player2);

        this.inited = true;

        this.allPlayers.push(player1.getComponent(HumanComponent), player2.getComponent(HumanComponent));
        this.freeMan.push(player1.getComponent(HumanComponent), player2.getComponent(HumanComponent));

        for (let i = 0; i < 50; i++) {
            let ball = new GameObject();
            ball.addComponent(BallComponent);
            collisionComponent = ball.addComponent(CollisionComponent);
            ball.position.x = 200 + Math.random() * 500;
            ball.position.y = 100 + Math.random() * 200;
            let ballRender = ball.addComponent(RenderComponent);
            let ballShape = new CircleShape();
            ballShape.radius = 20;
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

        let wallRight = new GameObject();
        wallRight.position.x = 980;
        wallRight.position.y = 0;
        let wallRightRenderComponent = wallRight.addComponent(RenderComponent);
        wallRightRenderComponent.color = 'green';
        boxShape = new BoxShape();
        boxShape.height = 2000;
        boxShape.width = 50;
        wallRightRenderComponent.shape = boxShape;
        this.game.getManager(AtomManager).spawn(wallRight);

        setTimeout(() => {
            this.notAttachedClients.forEach((client) => {
                this.attachToPlayer(client);
                this.game.networkService.pushCommands([new setToHuman({
                    human: this.playerAttached.get(client),
                    client: client
                })]);
            })
            this.notAttachedClients.length = 0;
        }, 1000);
    }

    public update(tpf: number) {
        for (let player of this.allPlayers) {
            player.update(tpf);
        }
    }

    public getCommands(): Command[] | null {
        if (this.commands) {
            let commands = this.commands;
            this.commands = [];
            return commands;
        }
        return null;
    }

    public attachToPlayer(client: Client) {
        let man = this.freeMan.pop();
        if (!man) {
            return;
        }
        this.playerAttached.set(client, man);
        client.attachEventListener('close', () => this.freeMan.push(man));
    }

    public networkJump(client: Client) {
        this.playerAttached.get(client).jump();
        this.game.getManager(RpcManager).callOnComponent(client, this.playerAttached.get(client), 'jump');
    }

    public networkMove(client: Client, dir: number) {
        this.playerAttached.get(client).moveDirection = dir;
        // this.game.getManager(RpcManager).callOnComponent(client, this.playerAttached.get(client), 'move');
    }

    public setLocalHuman(human: HumanComponent) {
        this.currentPlayer = human;
    }
}
