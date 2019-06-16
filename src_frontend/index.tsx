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

import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

import { StoreInterface, StoreBackend, DataFetchOptions, TableData } from "./store";

import { Tabs } from "./Tabs";
import { TableHandler } from "./TableHandler"
import { PlotHandler } from "./PlotHandler"

function App() {

  let store = new StoreBackend()

  let tabContents = [
    {
      name: "Table",
      component: <TableHandler store={store}/>,
    },
    {
      name: "Plot",
      component: <PlotHandler store={store}/>,
    }
  ]

  return (
    <div class="container">
      <Tabs contents={tabContents}/>
    </div>
  )
}


let el = document.getElementById('ROOT')!;
createRoot(() => el.appendChild(<App/>));
