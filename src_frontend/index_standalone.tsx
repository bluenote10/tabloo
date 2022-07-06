// Needs to be imported once to enable lifecycle hooks
import "./dom_lifecycle";

import { render } from "solid-js/web";
import { App } from "./App";
import { StoreStandalone } from "./store_standalone";

const store = new StoreStandalone();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const el = document.getElementById("ROOT")!;
render(() => <App store={store} />, el);
