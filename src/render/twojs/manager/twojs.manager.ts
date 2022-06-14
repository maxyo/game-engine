import {Atom, Event, IUpdatableManager, Manager} from "../../../core";
import Two from "two.js";
import {TwojsComponent} from "../component/twojs.component";
import {Element as TwoElement} from "two.js/src/element";

export class TwojsManager extends Manager implements IUpdatableManager {
    private two: Two;
    private element: Element;
    private elementChangedHandler = event => this.onComponentElementChanged(event)

    private components: TwojsComponent[] = [];

    init() {
        super.init();
        this.two = new Two({
            type: Two.Types.svg,
            fullscreen: true,
            autostart: true
        }).appendTo(this.element);

        this.game.getScene().attachEventListener('attached', (event) => this.onAttached(event.data[0]));
        this.game.getScene().attachEventListener('detached', (event) => this.onDetached(event.data[0]));
        this.game.getScene().getObjects().forEach(obj => this.onAttached(obj))
    }

    private onAttached(atom: Atom) {
        const component = atom.getComponent(TwojsComponent);
        if (component) {
            this.components.push(component);
            component.attachEventListener('elementChanged', this.elementChangedHandler)
            this.two.add(component.element);
        }
    }

    private onDetached(atom: Atom) {
        const component = atom.getComponent(TwojsComponent);
        if (component) {
            this.components.remove(component);
            component.detachEventListener('elementChanged', this.elementChangedHandler)
            this.two.remove(component.element);
        }
    }

    onComponentElementChanged(event: Event & { data: { new: TwoElement | null, old: TwoElement | null }[] }) {
        event.data.forEach(it => {
            if (it.old) {
                this.two.remove(it.old);
            }
            if (it.new) {
                this.two.add(it.new);
            }
        });
    }

    setElement(element: Element) {
        this.element = element;
    }

    async update(tpf: number): Promise<void> {
        this.two.update()
    }
}