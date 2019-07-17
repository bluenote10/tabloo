// Needs to be imported once to enable lifecycle hooks
import './dom_lifecycle';

import { createRoot } from 'solid-js';
import { App } from "./App";
import { StoreBackend } from "./store_backend";

let store = new StoreBackend()

let el = document.getElementById('ROOT')!;
createRoot(() => el.appendChild(<App store={store}/>));
