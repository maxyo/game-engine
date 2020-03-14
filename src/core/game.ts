import {WebsocketServer} from "./network/transport/server/websocket-server";
import {IServerConfig} from "websocket";
import {Transport} from "./network/transport/transport";
import {Manager} from "./manager/manager";
import {NetworkService} from "./network/network-service";
import {GameObjectsManager} from "./scene/atom/game-object/game-object";
import {Scene} from "./scene/scene";
import {isUpdatable, sleep} from "./util/functions";
import {WebsocketClient} from "./network/transport/client/websocket-client";
import {Updatable} from "./scene/atom/interfaces/updatable";
import {ManagerWithCommands} from "./manager/manager-types";
import {HtmlRenderManager} from "./manager/html-render-manager";
import {SceneLoader} from "./scene/scene-loader";
import {encode} from "msgpack";
import {SomeObject} from "./scene/atom/game-object/some-object";

export class Game {
    /**
     * Класс управляющий игрой, её процессом, содержащий список объектов и их состояний для отправки клиентам.
     *
     * Контроллирует менеджеров, которые в свою очередь контроллируют объекты и собирают данные для отправки клиентам.
     *
     */

    private name: string;

    private managers: Array<Manager> = [];
    private managersUpdatable: Array<Manager & Updatable> = [];
    private managersWithCommands: Array<Manager & ManagerWithCommands> = [];

    private readonly networkService: NetworkService;
    private readonly transport: Transport;

    private state: GameState = GameState.Preparing;

    private scene: Scene;

    public readonly gameMode: GameMode;

    constructor(config: IGameConfig) {
        this.gameMode = config.mode;

        this.initManagers();

        if (this.gameMode === GameMode.Server) {
            this.transport = new WebsocketServer(config.serverConfig);
            this.scene = SceneLoader.load(config.scenePath);
        } else {
            this.transport = new WebsocketClient(config.serverAddress, config.port);
        }
        this.networkService = new NetworkService(this.transport);

        let obj = new SomeObject('asd');

        console.log((JSON.parse(JSON.stringify(obj)) as SomeObject));
    }

    public start() {
        this.state = GameState.Running;
        this.loop();
    }

    public getScene(): Scene {
        return this.scene;
    }

    private initManagers() {
        if (this.gameMode == GameMode.Server) {
            this.managers = [
                new GameObjectsManager(this),
            ];
        } else {
            this.managers = [
                new GameObjectsManager(this),
                new HtmlRenderManager(this)
            ];
        }

        for (let manager of this.managers) {
            if (isUpdatable(manager)) {
                this.managersUpdatable.push(manager);
            }
            if (manager instanceof ManagerWithCommands) {
                this.managersWithCommands.push(manager);
            }
        }

        console.log(this.managers)
    }

    private async loop() {
        let prevTime = Date.now();
        let curTime;
        let elapsed = 0;
        let lag = 0;

        while (this.state === GameState.Running) {
            curTime = Date.now();
            elapsed = curTime - prevTime;
            lag += elapsed;

            this.processInput();

            while (lag >= MS_PER_TICK) {
                this.processManagers(1 + ((lag % MS_PER_TICK) / MS_PER_TICK));
                lag -= MS_PER_TICK + (lag % MS_PER_TICK);
            }

            this.processNetwork();
            this.processRender();

            prevTime = curTime;

            await sleep(MS_PER_TICK + curTime - Date.now());
        }
    }

    private processNetwork() {
        for (let manager of this.managersWithCommands) {
            this.networkService.pushCommands(manager.flushCommands());
        }
        this.networkService.transmit();
    }

    private processManagers(tick_lag: number) {
        for (let manager of this.managersUpdatable) {
            manager.update(tick_lag);
        }
    }

    private processInput() {

    }

    private processRender() {
    }

    private loadScene(scene: Scene) {

    }

    private stop() {
        this.state = GameState.Stop;
    }
}

export interface IGameConfig {
    mode: GameMode,
    serverConfig?: IServerConfig,   // if mode==Server
    scenePath?: string,             // if mode==Server

    serverAddress?: string,         // if mode==Client
    port?: string                   // if mode==Client
}

export enum GameMode {
    Server,
    Front,
    Player
}

export enum GameState {
    Preparing,
    Running,
    Stop,
}

const MS_PER_TICK: number = 16;
