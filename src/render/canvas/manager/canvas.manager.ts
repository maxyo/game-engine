import {Manager} from "../../../core/manager/manager";
import {IUpdatableManager} from "../../../core/manager/manager-types";
import {CanvasComponent} from "../component/canvas.component";
import {BoxShape} from "../shape/box.shape";
import {InitializeError} from "../../../error/initialize.error";
import {CircleShape} from "../shape/circle.shape";
import {MeshShape} from "../shape/mesh.shape";
import {EngineError} from "../../../error/engine.error";
import {Vector} from "../../../core/math/vector";

export class CanvasManager extends Manager implements IUpdatableManager {
    canvas: HTMLCanvasElement;

    components: CanvasComponent[] = [];

    init() {
        super.init();

        if (!this.canvas) {
            throw new InitializeError('Failed to find canvas element');
        }

        this.handleComponentsAt(CanvasComponent, this.components);
    }

    setCanvasElement(element: HTMLCanvasElement) {
        this.canvas = element;
    }

    update(tpf: number) {
        const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
        ctx.shadowColor = 'white'
        ctx.shadowBlur = 20
        ctx.shadowOffsetX = 2
        ctx.clearRect(0, 0, 10000, 10000);
        this.components.sort((a, b) => a.layer - b.layer).forEach(component => {
            ctx.beginPath();
            if (component.shape instanceof BoxShape) {
                this.drawBox(ctx, component as CanvasComponent & { shape: BoxShape })
            } else if (component.shape instanceof CircleShape) {
                this.drawCircle(ctx, component as CanvasComponent & { shape: CircleShape })
            } else if (component.shape instanceof MeshShape) {
                this.drawMesh(ctx, component as CanvasComponent & { shape: MeshShape })
            } else {
                throw new EngineError(`Unexpected shape type: ${component.constructor.name}`);
            }
            ctx.closePath();
        });
    }

    private drawBox(ctx: CanvasRenderingContext2D, component: CanvasComponent & { shape: BoxShape }) {
        const position = this.calculateDrawPosition(component);
        position.x -= component.shape.width / 2;
        position.y -= component.shape.height / 2;

        if (!component.fill) {
            ctx.strokeStyle = component.color
            ctx.strokeStyle
            ctx.strokeRect(position.x, position.y, component.shape.width, component.shape.height);
        } else {
            ctx.fillStyle = component.color
            ctx.fillRect(position.x, position.y, component.shape.width, component.shape.height);
        }
    }

    private drawCircle(ctx: CanvasRenderingContext2D, component: CanvasComponent & { shape: CircleShape }) {
        const position = this.calculateDrawPosition(component);
        ctx.arc(position.x, position.y, component.shape.radius, 0, Math.PI * 2)
        if (component.fill) {
            ctx.fillStyle = component.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = component.color;
            ctx.stroke();
        }
    }

    private drawMesh(ctx: CanvasRenderingContext2D, component: CanvasComponent & { shape: MeshShape }) {
        const position = this.calculateDrawPosition(component);
        const firstPoint = component.shape.points[0];

        ctx.moveTo(
            firstPoint.x + position.x,
            firstPoint.y + position.y
        )

        component.shape.points.forEach((point) => {
            ctx.lineTo(
                point.x + position.x,
                point.y + position.y
            );
        });

        ctx.lineTo(
            firstPoint.x + position.x,
            firstPoint.y + position.y
        )

        if (component.fill) {
            ctx.fillStyle = component.color;
            ctx.fill();
        } else {
            ctx.strokeStyle = component.color;
            ctx.stroke();
        }

    }


    private calculateDrawPosition(component: CanvasComponent) {
        const result = new Vector(
            component.go.transform.position.x + component.shape.offset.x,
            component.go.transform.position.y + component.shape.offset.y
        )

        return result;
    }
}
