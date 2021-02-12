import {Manager} from "../../../core/manager/manager";
import {IUpdatableManager} from "../../../core/manager/manager-types";
import {RigidBodyComponent} from "../../component/rigid-body-component";
// import * as Ammo from "ammo.js/ammo";
import {Atom} from "../../../core/scene/atom";
import {AbstractPhysicsManager} from "../../manager/abstract-physics-manager";
import btTypedConstraint = Ammo.btTypedConstraint;
import {AmmoRigidBody} from "./ammo-rigid-body";

export class AmmoPhysicsManager extends AbstractPhysicsManager implements IUpdatableManager {

    private collisionConfiguration: Ammo.btDefaultCollisionConfiguration;
    private dispatcher: Ammo.btCollisionDispatcher;
    private overlappingPairCache: Ammo.btBroadphaseInterface;
    private solver: Ammo.btSequentialImpulseConstraintSolver;
    private dynamicsWorld: Ammo.btDiscreteDynamicsWorld;

    private components: Array<RigidBodyComponent> = [];

    init() {
        super.init();
        this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
        this.overlappingPairCache = new Ammo.btDbvtBroadphase();
        this.solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);

        this.game.getScene().attachEventListener('attached', (event) => this.catchComponent(event.data[0]));
        this.game.getScene().attachEventListener('detached', (event) => this.removeComponent(event.data[0]));
    }

    update(tpf: number) {
        this.dynamicsWorld.stepSimulation(tpf);
        this.components.forEach(comp => comp.update(tpf));
    }

    private catchComponent(atom: Atom) {
        let component = atom.getComponent(RigidBodyComponent)
        if (component) {
            this.components.push(component as any);
            this.dynamicsWorld.addRigidBody(component.rb);
        }
    }

    private removeComponent(atom: Atom) {
        let component = atom.getComponent(RigidBodyComponent)
        if (component) {
            this.components.push(component);
            this.dynamicsWorld.removeRigidBody(component.rb);
        }
    }
}