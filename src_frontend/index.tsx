// Needs to be imported once to enable lifecycle hooks
import './dom_lifecycle';

import { createRoot } from 'solid-js';
import { App } from "./App";

let el = document.getElementById('ROOT')!;
createRoot(() => el.appendChild(<App/>));
