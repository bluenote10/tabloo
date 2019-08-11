// Needs to be imported once to enable lifecycle hooks
import './dom_lifecycle';

import { render } from 'solid-js/dom';
import { App } from "./App";
import { StoreStandalone } from "./store_standalone";

let store = new StoreStandalone()

let el = document.getElementById('ROOT')!;
let app = <App store={store}/>
render(() => app, el);
