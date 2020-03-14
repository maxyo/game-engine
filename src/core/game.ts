import {WebsocketTransport} from "./network/transport/websocket-transport";
import {IServerConfig} from "websocket";
import {Transport} from "./network/transport/transport";
import {Manager} from "./manager/manager";
import {NetworkService} from "./network/network-service";
import {GameObjectsManager} from "./scene/atom/game-object/game-object";
import {Scene} from "./scene/scene";
import {sleep} from "./util/functions";

export class Game {
    /**
     * Класс управляющий игрой, её процессом, содержащий список объектов и их состояний для отправки клиентам.
     *
     * Контроллирует менеджеров, которые в свою очередь контроллируют объекты и собирают данные для отправки клиентам.
     *
     */

    private name: string;

    private managers: Manager[] = [];
    private readonly networkService: NetworkService;

    private readonly transport: Transport;

    private stopping: boolean;

    public static instance;

    private mode: GameMode;


    constructor(config: IGameConfig) {
        if (Game.instance) {
            // WTF
            throw new Error('Trying to create another Game instance.');
        }
        Game.instance = this;

        this.initManagers();

        this.transport = new WebsocketTransport(config.serverConfig);
        this.networkService = new NetworkService(this.transport);
    }

    public start() {
        this.loop();
    }

    private initManagers() {
        this.managers = [
            new GameObjectsManager,
        ];
    }

    private async loop() {
        let prevTime = Date.now();
        let curTime;
        let elapsed = 0;
        let lag = 0;

        while (!this.stopping) {
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
        for (let manager of this.managers) {
            this.networkService.pushCommands(manager.flushCommands());
        }
        this.networkService.transmit();
    }

    private processManagers(tick_lag: number) {
        for (let manager of this.managers) {
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
        this.stopping = true;
    }
}

export interface IGameConfig {
    mode: GameMode,
    serverConfig?: IServerConfig,   // if mode==Server
    scenePath?: string,             // if mode==Server

    serverAddress?: string,         // if mode==Client
    port?: number                   // if mode==Client
}

export enum GameMode {
    Server,
    Front,
    Player
}

const MS_PER_TICK: number = 16;
