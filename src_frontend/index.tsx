import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

import { StoreInterface, StoreBackend, DataFetchOptions, TableData } from "./store";

import { Tabs } from "./Tabs";
import { TableHandler } from "./TableHandler"

function App() {

  let store = new StoreBackend()

  let tabContents = [
    {
      name: "Table",
      component: <TableHandler store={store}/>,
    },
    {
      name: "Tab B",
      component: <div>TODO</div>,
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
