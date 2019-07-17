// Needs to be imported once to enable lifecycle hooks
import './dom_lifecycle';

import { createRoot } from 'solid-js';
import { App } from "./App";
import { StoreStandalone } from "./store_standalone";

let store = new StoreStandalone()

let el = document.getElementById('ROOT')!;
createRoot(() => el.appendChild(<App store={store}/>));
