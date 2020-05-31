import {Event} from "../core/event/event";
import {CollisionComponent} from "../core/component/collision-component";

export class CollisionEvent extends Event{
    public constructor(target: CollisionComponent, other: CollisionComponent) {
        super(target, {other: other});
    }

}
