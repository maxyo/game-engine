import {ServerTransport} from "../network/transport/server/server-transport";
import {Transport} from "../network/transport/transport";
import {Manager} from "./manager/manager";
import {NetworkService} from "../network/network-service";
import {Scene} from "./scene/scene";
import {ClientTransport} from "../network/transport/client/client-transport";
import {sleep} from "./util/utils";
import {
    INetworkManager,
    ISelectiveNetworkManager,
    isNetworkManager,
    isSelectiveNetworkManager,
    isUpdatableManager,
    IUpdatableManager
} from "./manager/manager-types";
import {Client} from "../network/client/client";
import {EventSourceTrait} from "./event/event-source-trait";
import {use} from "typescript-mix";
import {Player} from "./player";
import {ServerOptions} from "ws";
import {NullTransport} from "../network/transport/null.transport";

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

        Game.instance = this;

        if (this.gameMode === GameMode.Server) {
            this.transport = new ServerTransport(this, config.serverConfig);
            this.processNetwork = this.processServerNetwork;
        } else {
            if (config.serverAddress && config.port) {
                this.transport = new ClientTransport(this, config.serverAddress, config.port);
                this.processNetwork = this.processClientNetwork;
            } else {
                this.transport = new NullTransport(this);
            }
        }
        this.networkService = new NetworkService(this.transport);
    }

    public init() {
        this.initManagers();
    }

    public async start() {
        this.init();
        this.state = GameState.Running;
        await this.loop();
    }

    public getScene(): Scene {
        return this.scene;
    }

    private initManagers() {
        for (let manager of this.allManagers) {
            manager.init();
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

            await this.processInput();

            while (lag >= MS_PER_TICK) {
                await this.processManagers(1 + ((lag % MS_PER_TICK) / MS_PER_TICK));
                lag -= MS_PER_TICK + (lag % MS_PER_TICK);
            }

            await this.processNetwork();
            await this.processRender();

            prevTime = curTime;

            await sleep(MS_PER_TICK + curTime - Date.now());
        }
    }

    private processNetwork() {
    }

    private async processServerNetwork(): Promise<void> {
        const promises: Promise<void>[] = [];
        promises.push(...this.networkManagers.map(async manager => {
            const commands = await manager.getCommands();
            if (commands) {
                this.networkService.pushCommands(commands);
            }
        }));
        promises.push(...this.selectiveNetworkManagers.map(async manager => {
            for (let [key, client] of (this.transport as ServerTransport).clientsCollection.clients) {
                const commands = await manager.getCommandsForClient(client);
                if (commands) {
                    this.networkService.pushCommands(commands);
                }
            }
        }));

        await Promise.all(promises);

        this.networkService.transmit();
    }

    private async processClientNetwork(): Promise<void> {
        const promises = this.networkManagers.map(async manager => {
            const commands = await manager.getCommands();
            if (commands) {
                this.networkService.pushCommands(commands);
            }
        })
        await Promise.all(promises);

        this.networkService.transmit();
    }

    private async processManagers(tick_lag: number) {
        const promises = this.updatableManagers.map(async manager => manager.update(tick_lag))
        await Promise.all(promises);
    }

    private processInput() {
        return Promise.resolve();
    }

    private processRender() {
        return Promise.resolve();
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

    public addManager<T extends Manager>(type: { new(game: Game): T; }): T | undefined {
        let manager = new type(this);
        this.attachManager(manager)
        return manager;
    }

    public getManager<T extends Manager>(type: { new(game: Game): T; }): T | undefined {
        for (let manager of this.allManagers) {
            if (manager instanceof type) {
                return manager as T;
            }
        }
    }

    public removeManager<T extends Manager>(type: { new(game: Game): T; }): T | undefined {
        for (let manager of this.allManagers) {
            if (manager instanceof type) {
                this.detachManager(manager);
                return manager as T;
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
    serverConfig?: ServerOptions,   // if mode==Server
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
