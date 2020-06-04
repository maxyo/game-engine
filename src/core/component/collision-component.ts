import {Component} from "./component";
import {Shape} from "../../render/shape/shape";
import {CollisionEvent} from "../../collision/collision-event";
import {use} from "typescript-mix";
import {EventSourceTrait} from "../event/event-source-trait";
import {registerClass} from "../network/transport/serializer";

export interface CollisionComponent extends EventSourceTrait {

}

@registerClass
export class CollisionComponent extends Component {
    @use(EventSourceTrait) this;

    public shape: Shape;

    public triggerCollision(collisionEvent: CollisionEvent) {
        this.trigger('collide', collisionEvent);
    }
}
