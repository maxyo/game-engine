import {Manager} from "./manager";
import {IUpdatableManager} from "./manager-types";

export class RenderManager extends Manager implements IUpdatableManager{
    update(tick_lag: number): void {
    }
}
