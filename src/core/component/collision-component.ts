import {Component} from "./component";
import {IUpdatable} from "../scene/atom/interfaces/IUpdatable";
import {Shape} from "../../render/shape/shape";

export class CollisionComponent extends Component implements IUpdatable{

    public shape: Shape;

    update(tick_lag: number): void {
    }
}
