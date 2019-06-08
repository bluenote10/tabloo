import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

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
      name: "Tab B",
      component: <PlotHandler store={store}/>,
    }
  ]

  return (
    <div>
      <Tabs contents={tabContents}/>
    </div>
  )
}


let el = document.getElementById('ROOT')!;
createRoot(() => el.appendChild(<App/>));
