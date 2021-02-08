import {Component} from "../../core/component/component";
import {Atom} from "../../core/scene/atom";
import * as Ammo from "ammo.js/ammo";
import {Vector} from "../math/vector";
import btBroadphaseProxy = Ammo.btBroadphaseProxy;
import btCollisionObject = Ammo.btCollisionObject;
import btRigidBody = Ammo.btRigidBody;
import btMotionState = Ammo.btMotionState;

// @ts-ignore
export class RigidBodyComponent extends Component implements IUpdatable {
    public readonly rb: Ammo.btRigidBody;

    private tmp;

    private static _emptyShape;

    constructor(atom: Atom) {
        super(atom);

        this.rb = new Ammo.btRigidBody(
            new Ammo.btRigidBodyConstructionInfo(
                1,
                new Ammo.btDefaultMotionState(),
                new Ammo.btBoxShape(new Vector(1, 1, 1))
            )
        );
        this.rb.applyGravity()
    }

    update(tick_lag: number): void {
        this.go.transform.position.set(
            this.rb.getWorldTransform().getOrigin().x(),
            this.rb.getWorldTransform().getOrigin().y(),
            this.rb.getWorldTransform().getOrigin().z(),
        );
    }

    setSleepingThresholds(linear: number, angular: number): void {
        this.rb.setSleepingThresholds(linear, angular);
    }

    getLinearDamping(): number {
        return this.rb.getLinearDamping();
    }

    getAngularDamping(): number {
        return this.rb.getAngularDamping();
    }

    setDamping(lin_damping: number, ang_damping: number): void {
        this.rb.setDamping(lin_damping, ang_damping);
    }

    setMassProps(mass: number, inertia: Vector): void {
        this.rb.setMassProps(mass, inertia);
    }

    getLinearFactor(): Vector {
        return this.rb.getAngularFactor();

    }

    setLinearFactor(linearFactor: Vector): void {
        this.rb.setLinearFactor(linearFactor);
    }

    applyTorque(torque: Vector): void {
        this.rb.applyTorque(torque);
    }

    applyLocalTorque(torque: Vector): void {
        this.rb.applyLocalTorque(torque);
    }

    applyForce(force: Vector, rel_pos: Vector): void {
        this.rb.applyForce(force, rel_pos)
    }

    applyCentralForce(force: Vector): void {
        this.rb.applyCentralForce(force);
    }

    applyCentralLocalForce(force: Vector): void {
        this.rb.applyCentralLocalForce(force);
    }

    applyTorqueImpulse(torque: Vector): void {
        this.rb.applyTorque(torque);
    }

    applyImpulse(impulse: Vector, rel_pos: Vector): void {
        this.rb.applyImpulse(impulse, rel_pos);
    }

    applyCentralImpulse(impulse: Vector): void {
        this.rb.applyCentralImpulse(impulse);
    }

    updateInertiaTensor(): void {
        this.rb.updateInertiaTensor();
    }

    getLinearVelocity(): Vector {
        return this.rb.getLinearVelocity();

    }

    getAngularVelocity(): Vector {
        return this.rb.getAngularFactor();

    }

    setLinearVelocity(linearVelocity: Vector): void {
        this.rb.setLinearVelocity(linearVelocity);
    }

    setAngularVelocity(ang_vel: Vector): void {
        this.rb.setAngularVelocity(ang_vel);
    }

    getMotionState(): btMotionState {
        return this.rb.getMotionState();
    }

    setMotionState(motionState: btMotionState): void {
        this.rb.setMotionState(motionState);
    }

    getAngularFactor(): Vector {
        return this.rb.getAngularFactor();
    }

    setAngularFactor(angularFactor: Vector): void {
        this.rb.setAngularFactor(angularFactor);
    }

    upcast(colObj: btCollisionObject): btRigidBody {

    }

    getAabb(aabbMin: Vector, aabbMax: Vector): void {

    }

    applyGravity(): void {
        this.rb.applyGravity();
    }

    getGravity(): Vector {
        return this.rb.getGravity();
    }

    setGravity(acceleration: Vector): void {
        this.rb.setGravity(acceleration);
    }

    getBroadphaseProxy(): btBroadphaseProxy {
        return null;
    }

}