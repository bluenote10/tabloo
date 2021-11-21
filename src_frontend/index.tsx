// Needs to be imported once to enable lifecycle hooks
import './dom_lifecycle';

import { render } from 'solid-js/web';
import { App } from "./App";
import { StoreBackend } from "./store_backend";

let store = new StoreBackend()

let el = document.getElementById('ROOT')!;
render(() => <App store={store}/>, el);
