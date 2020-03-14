import {SpriteResource} from '../../resources/sprite-resource';
import {sync, Transportable} from '../../network/transport/transportable';
import {Manager} from "../../manager/manager";
import {GameObjectsManager} from "./game-object/game-object";

let LATEST_ID = 0;

/**
 * Базовый игровой объект
 */
export abstract class Atom extends Transportable {
    @sync id: number;

    @sync name: string;
    @sync sprite: SpriteResource;

    protected static manager: Manager;

    protected constructor(name = '') {
        super();
        this.id = LATEST_ID++;
        this.name = name;
        this.sprite = new SpriteResource();
    }

    public init() {
        this.onInit();
    }

    public destroy() {
        this.onDestroy();
        // this.manager.detach(this);
        // delete this;
    }

    protected onInit() {
    }

    protected onDestroy() {
    }

    public static setManager(manager: GameObjectsManager) {
        if (this.manager) {
            throw new Error();
        }
        this.manager = manager;
    }
}



