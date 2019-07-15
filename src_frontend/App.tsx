
import { StoreBackend } from "./store";

import { Tabs } from "./Tabs";
import { TableHandler } from "./TableHandler"
import { PlotHandler } from "./PlotHandler"


export function App() {

  let store = new StoreBackend()

  let tabContents = [
    {
      name: <span><i class="fas fa-database"></i> Table </span>,
      component: <TableHandler store={store}/>,
    },
    {
      name: <span><i class="fas fa-chart-bar"></i> Plot </span>,
      component: <PlotHandler store={store}/>,
    }
  ]

  return (
    <div class="container">
      <Tabs contents={tabContents}/>
    </div>
  )
}
