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
import {AtomManager} from "./manager/atom-manager";
import {HtmlRenderManager} from "./manager/html-render-manager";
import {LogicManager} from "./manager/logic-manager";
import {Client} from "./network/client/client";
import {EventSourceTrait} from "./event/event-source-trait";
import {use} from "typescript-mix";
import {Player} from "./player";
import {PlayerManager} from "./manager/player-manager";
import {InputManager} from "./manager/input-manager";
import {RpcManager} from "./manager/rpc-manager";

export interface Game extends EventSourceTrait {

}

export class Game {
    @use(EventSourceTrait) this;
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

    public get clients(): undefined | Map<string, Client> {
        if (this.gameMode !== GameMode.Server) {
            return undefined;
        }
        return (this.transport as ServerTransport).clientsCollection.clients;
    }

    public get isServer(): boolean {
        return this.gameMode === GameMode.Server;
    }

    private readonly players: Player[] = [];

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
            this.attachManager(new AtomManager(this));
            this.attachManager(new LogicManager(this));
            this.attachManager(new RpcManager(this));
        } else {
            this.attachManager(new PlayerManager(this));
            this.attachManager(new AtomManager(this));
            this.attachManager(new HtmlRenderManager(this));
            this.attachManager(new LogicManager(this));
            this.attachManager(new InputManager(this));
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
            for (let [key, client] of (this.transport as ServerTransport).clientsCollection.clients) {
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

    private attachManager(manager: Manager) {
        this.allManagers.push(manager);
        if (isNetworkManager(manager)) {
            this.networkManagers.push(manager as Manager & INetworkManager);
        }
        if (isSelectiveNetworkManager(manager)) {
            this.selectiveNetworkManagers.push(manager as Manager & ISelectiveNetworkManager);
        }
        if (isUpdatableManager(manager)) {
            this.updatableManagers.push(manager as Manager & IUpdatableManager);
        }
        this.trigger('managerAdd', manager)
    }

    private detachManager(manager: Manager) {
        this.allManagers.remove(manager);
        this.networkManagers.remove(manager as Manager & INetworkManager);
        this.selectiveNetworkManagers.remove(manager as Manager & ISelectiveNetworkManager);
        this.updatableManagers.remove(manager as Manager & IUpdatableManager);
        this.trigger('managerRemove', manager)
    }

    public addManager<T extends Manager>(type: { new(game: Game): T; }): T {
        let manager = new type(this);
        this.attachManager(manager)
        return manager;
    }

    public getManager<T extends Manager>(type: { new(game: Game): T; }): T {
        for (let manager of this.allManagers) {
            if (manager instanceof type) {
                return manager as T;
            }
        }
    }

    public removeManager<T extends Manager>(type: { new(game: Game): T; }): T {
        for (let manager of this.allManagers) {
            if (manager instanceof type) {
                this.detachManager(manager);
                return manager;
            }
        }
    }

    public attachPlayer(player: Player) {
        this.players.push(player);
        this.trigger('playerAdd', player);
    }

    public detachPlayer(player: Player) {
        this.players.remove(player);
        this.trigger('playerRemove', player);
    }
}

export interface IGameConfig {
    mode: GameMode,
    serverConfig?: {},   // if mode==Server
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
