import {Component} from "../../core/component/component";
import {registerClass} from "../../core/network/transport/serializer";
import {NetworkType} from "../../core/network/transport/network-type";
import {BufferGeometry, Material, Object3D, Vector3} from "three";
import {use} from "typescript-mix";
import {IUpdatable} from "../../core/scene/atom/interfaces/IUpdatable";
import {GameObject} from "../../core/scene/atom/game-object/game-object";

@registerClass
export class RenderComponent extends Component {

    private _object: Object3D;

    set object(obj: Object3D) {
        let self = this;
        Reflect.defineProperty(obj, 'position', {
            get(): any {
                return self.go.position;
            }
        });
        Reflect.defineProperty(obj, 'rotation', {
            get(): any {
                return self.go.rotation;
            }
        });
        Reflect.defineProperty(obj, 'scale', {
            get(): any {
                return self.go.scale;
            }
        });
        this._object = obj;
    }

    get object() {
        return this._object;
    }

    static get netScheme() {
        return {
            ...super.netScheme,
            color: {type: NetworkType.STRING},
            shape: {type: NetworkType.CLASSINSTANCE}
        };
    };
}
