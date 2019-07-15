/**
 * This would be the alternative for using fontawesome from JS.
 * The benefit would be that there is no dependence on serving
 * webfonts. Unfortunately, the observer technique used by the
 * fontawesome JS seems to massively slow down DOM modifications.
 */
// import '@fortawesome/fontawesome-free/js/fontawesome'
// import '@fortawesome/fontawesome-free/js/solid'
// import '@fortawesome/fontawesome-free/js/regular'
// import '@fortawesome/fontawesome-free/js/brands'

// Needs to be imported once to enable lifecycle hooks
import './dom_lifecycle';

import { createRoot } from 'solid-js';
import { App } from "./App";

let el = document.getElementById('ROOT')!;
createRoot(() => el.appendChild(<App/>));
