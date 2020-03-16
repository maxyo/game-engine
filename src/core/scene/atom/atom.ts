import {SpriteResource} from '../../resources/sprite-resource';
import {sync, Transportable} from '../../network/transport/transportable';
import {Manager} from "../../manager/manager";

let LATEST_ID = 0;

/**
 * Базовый игровой объект
 */
export abstract class Atom extends Transportable {
    @sync id: number;

    @sync name: string;
    @sync sprite: SpriteResource;

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
}



