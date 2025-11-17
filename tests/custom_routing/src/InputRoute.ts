import { type LocationValue, Route } from "../../../index.ts";

export class InputRoute extends Route {
  inputId: string;

  constructor(inputId: string, location?: LocationValue) {
    super(location);
    this.inputId = inputId;
  }

  _getElement() {
    return document.querySelector<HTMLInputElement>(`#${this.inputId}`);
  }

  _getHref(location?: LocationValue) {
    if (location === undefined || location === null)
      return typeof window === "undefined"
        ? ""
        : (this._getElement()?.value ?? "");

    return String(location);
  }

  _subscribe() {
    let handleInput = (event: KeyboardEvent) => {
      let element = event.target;

      if (
        element instanceof HTMLInputElement &&
        element.id === this.inputId &&
        event.key === "Enter"
      ) {
        event.preventDefault();
        this._navigate(element.value);
      }
    };

    window.addEventListener("keydown", handleInput);

    return () => {
      window.removeEventListener("keydown", handleInput);
    };
  }

  _transition(nextHref: string) {
    if (typeof window === "undefined") return;

    let input = this._getElement();

    if (input && input.value !== nextHref) input.value = nextHref;
  }
}
