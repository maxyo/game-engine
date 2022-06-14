import {Atom, Component} from "../../../core";
import {Element as TwoElement} from "two.js/src/element";

export class TwojsComponent extends Component {
    private _element: TwoElement;

    set element(value: TwoElement) {
        this.trigger('elementChanged', {
            old: this._element,
            new: value
        });

        this._element = value;
    }

    get element() {
        return this._element;
    }

    constructor(go: Atom) {
        super(go);
        this.element = new TwoElement();
    }
}