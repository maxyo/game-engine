import {RigidBodyInterface} from "../rigidbody/rigid-body-interface";
import {use} from "typescript-mix";
import {EventSourceTrait, Vector} from "../../core";


export interface Joint extends EventSourceTrait {

}

export abstract class Joint {
    @use(EventSourceTrait) this;

    protected _rbA: RigidBodyInterface;
    protected _rbB: RigidBodyInterface;

    protected _breakingImpulseThreshold: number;

    protected _enableCollision: boolean;

    protected constructor(
        rbA: RigidBodyInterface,
        rbB: RigidBodyInterface,
        breakImpulseThreshold: number,
        enableCollision: boolean
    ) {
        this._rbA = rbA;
        this._rbB = rbB;
        this._breakingImpulseThreshold = breakImpulseThreshold;
        this._enableCollision = enableCollision;
    }

    public get rbA() {
        return this._rbA;
    }

    public get rbB() {
        return this._rbB;
    }

    public get breakingImpulseThreshold(): number {
        return this._breakingImpulseThreshold
    }

    public get enableCollision(): boolean {
        return this._enableCollision;
    }
}

export class FixedJoint extends Joint {
    constructor(
        rbA: RigidBodyInterface,
        rbB: RigidBodyInterface,
        breakImpulseThreshold: number,
        enableCollision: boolean,
    ) {
        super(
            rbA,
            rbB,
            breakImpulseThreshold,
            enableCollision,
        );
    }
}

export class HingeJoint extends Joint {
    get rbAPivot(): Vector {
        return this._rbAPivot;
    }

    get rbBPivot(): Vector {
        return this._rbBPivot;
    }

    get rbAAxis(): Vector {
        return this._rbAAxis;
    }

    get rbBAxis(): Vector {
        return this._rbBAxis;
    }

    protected _rbAPivot: Vector;
    protected _rbBPivot: Vector;
    protected _rbAAxis: Vector;
    protected _rbBAxis: Vector;

    constructor(
        rbA: RigidBodyInterface,
        rbB: RigidBodyInterface,
        rbAPivot: Vector,
        rbBPivot: Vector,
        rbAAxis: Vector,
        rbBAxis: Vector,
        breakImpulseThreshold: number,
        enableCollision: boolean,
    ) {
        super(
            rbA,
            rbB,
            breakImpulseThreshold,
            enableCollision,
        );
        this._rbAAxis = rbAAxis;
        this._rbBPivot = rbBPivot;
        this._rbAAxis = rbAAxis;
        this._rbBAxis = rbBAxis;
    }
}

export class SliderJoint extends Joint {
    //todo implement
}