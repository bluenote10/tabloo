// Needs to be imported once to enable lifecycle hooks
import "./dom_lifecycle";

import { render } from "solid-js/web";
import { App } from "./App";
import { StoreBackend } from "./store_backend";

const store = new StoreBackend();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const el = document.getElementById("ROOT")!;
render(() => <App store={store} />, el);
