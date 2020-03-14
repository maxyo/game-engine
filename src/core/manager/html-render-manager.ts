import {Manager} from "./manager";
import {Updatable} from "../scene/atom/interfaces/updatable";

export class RenderManager extends Manager implements Updatable{
    update(tick_lag: number): void {
    }

}
