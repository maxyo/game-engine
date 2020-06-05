import {Component} from "./component";
import {Shape} from "../../render/shape/shape";
import {CollisionEvent} from "../../collision/collision-event";
import {use} from "typescript-mix";
import {EventSourceTrait} from "../event/event-source-trait";
import {registerClass} from "../network/transport/serializer";
import {NetworkType} from "../network/transport/network-type";

export interface CollisionComponent extends EventSourceTrait {

}

@registerClass
export class CollisionComponent extends Component {
    @use(EventSourceTrait) this;

    public shape: Shape;

    static get netScheme() {
        return {
            ...super.netScheme,
            shape: {type: NetworkType.CLASSINSTANCE}
        };
    };

    public triggerCollision(collisionEvent: CollisionEvent) {
        this.trigger('collide', collisionEvent);
    }
}
