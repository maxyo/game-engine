import {ServerTransport} from "./network/transport/server/server-transport";
import {Transport} from "./network/transport/transport";
import {Manager} from "./manager/manager";
import {NetworkService} from "./network/network-service";
import {Scene} from "./scene/scene";
import {ClientTransport} from "./network/transport/client/client-transport";
import {sleep} from "./util/functions";
import {
    INetworkManager,
    ISelectiveNetworkManager,
    isNetworkManager,
    isSelectiveNetworkManager,
    isUpdatableManager,
    IUpdatableManager
} from "./manager/manager-types";
import {AtomSyncManager} from "./manager/atom-sync-manager";
import {HtmlRenderManager} from "./manager/html-render-manager";
import {IServerConfig} from "websocket";
import {LogicManager} from "./manager/logic-manager";
import {HtmlInputManager} from "./manager/html-input-manager";

export class Game {
    /**
     * Класс управляющий игрой, её процессом, содержащий список объектов и их состояний для отправки клиентам.
     *
     * Контроллирует менеджеров, которые в свою очередь контроллируют объекты и собирают данные для отправки клиентам.
     *
     */

    private allManagers: Manager[] = [];
    private networkManagers: Array<Manager & INetworkManager> = [];
    private selectiveNetworkManagers: Array<Manager & ISelectiveNetworkManager> = [];
    private updatableManagers: Array<Manager & IUpdatableManager> = [];

    private state: GameState = GameState.Preparing;

    private readonly networkService: NetworkService;
    public readonly transport: Transport;

    private scene: Scene = new Scene();

    public readonly gameMode: GameMode;

    public static instance: Game;

    constructor(config: IGameConfig) {
        this.gameMode = config.mode;

        this.initManagers();

        Game.instance = this;

        if (this.gameMode === GameMode.Server) {
            this.transport = new ServerTransport(this, config.serverConfig);
            this.processNetwork = this.processServerNetwork;
        } else {
            this.transport = new ClientTransport(this, config.serverAddress, config.port);
            this.processNetwork = this.processClientNetwork;
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
                new LogicManager(this),
            ];
        } else {
            this.allManagers = [
                new HtmlRenderManager(this),
                new LogicManager(this),
                new HtmlInputManager(this),
            ];
        }

        for (let manager of this.allManagers) {
            if (isNetworkManager(manager)) {
                this.networkManagers.push(manager as Manager & INetworkManager);
            }
            if (isSelectiveNetworkManager(manager)) {
                this.selectiveNetworkManagers.push(manager as Manager & ISelectiveNetworkManager);
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

    private processNetwork(): void {
    }

    private processServerNetwork(): void {
        for (let manager of this.networkManagers) {
            this.networkService.pushCommands(manager.getCommands());
        }
        for (let manager of this.selectiveNetworkManagers) {
            for (let client of Object.values((this.transport as ServerTransport).clientsCollection.clients)) {
                this.networkService.pushCommands(manager.getCommandsForClient(client));
            }
        }
        this.networkService.transmit();
    }

    private processClientNetwork(): void {
        for (let manager of this.networkManagers) {
            this.networkService.pushCommands(manager.getCommands());
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
