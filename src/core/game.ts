import {WebsocketServer} from "./network/transport/server/websocket-server";
import {Transport} from "./network/transport/transport";
import {Manager} from "./manager/manager";
import {NetworkService} from "./network/network-service";
import {Scene} from "./scene/scene";
import {WebsocketClient} from "./network/transport/client/websocket-client";
import {SceneLoader} from "./scene/scene-loader";
import {sleep} from "./util/functions";
import {INetworkManager, isNetworkManager, isUpdatableManager, IUpdatableManager} from "./manager/manager-types";
import {AtomSyncManager} from "./manager/atom-sync-manager";
import {HtmlRenderManager} from "./manager/html-render-manager";
import {IServerConfig} from "websocket";
import {GameObject} from "./scene/atom/game-object/game-object";

export class Game {
    /**
     * Класс управляющий игрой, её процессом, содержащий список объектов и их состояний для отправки клиентам.
     *
     * Контроллирует менеджеров, которые в свою очередь контроллируют объекты и собирают данные для отправки клиентам.
     *
     */

    private name: string;

    private allManagers: Manager[] = [];
    private networkManagers: Array<Manager & INetworkManager> = [];
    private updatableManagers: Array<Manager & IUpdatableManager> = [];

    private state: GameState = GameState.Preparing;

    private readonly networkService: NetworkService;
    private readonly transport: Transport;

    private scene: Scene = new Scene();

    public readonly gameMode: GameMode;

    constructor(config: IGameConfig) {
        this.gameMode = config.mode;

        this.initManagers();

        if (this.gameMode === GameMode.Server) {
            this.transport = new WebsocketServer(this, config.serverConfig);
            // this.scene = SceneLoader.load(config.scenePath);
        } else {
            this.transport = new WebsocketClient(this, config.serverAddress, config.port);
        }
        this.networkService = new NetworkService(this.transport);
    }

    public start() {
        this.state = GameState.Running;
        this.loop();
    }

    public getScene(): Scene {
        return this.scene;
    }

    private initManagers() {

        if (this.gameMode === GameMode.Server) {
            this.allManagers = [
                new AtomSyncManager(this),
            ];
        } else {
            this.allManagers = [
                new HtmlRenderManager(this)
            ];
        }

        for (let manager of this.allManagers) {
            if (isNetworkManager(manager)) {
                this.networkManagers.push(manager as Manager & INetworkManager);
            }
            if (isUpdatableManager(manager)) {
                this.updatableManagers.push(manager as Manager & IUpdatableManager);
            }
        }
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
        for (let manager of this.networkManagers) {
            this.networkService.pushCommands(manager.flushCommands());
        }
        this.networkService.transmit();
    }

    private processManagers(tick_lag: number) {
        for (let manager of this.updatableManagers) {
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
        this.state = GameState.Stopping;
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
    Stopping
}

const MS_PER_TICK: number = 16;
