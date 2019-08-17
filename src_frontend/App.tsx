
import { createState } from 'solid-js';

import { StoreInterface } from "./store";

import { Tabs } from "./Tabs";
import { TableHandler } from "./TableHandler"
import { PlotHandler } from "./PlotHandler"

import { IconDatabase, IconChartBar } from "./Icons"

interface TabConfig {
  name: {
    icon: string,
    text: string,
  }
  widgets: WidgetConfig[]
}

interface WidgetConfig {
  type: string
}

export function App({store} : {store: StoreInterface}) {

  const [state, setState] = createState({
    appstate: {
      tabs: [
        {
          name: {
            icon: "database",
            text: "Table",
          },
          widgets: [
            {
              type: "table"
            }
          ]
        },
        {
          name: {
            icon: "plot",
            text: "Plot",
          },
          widgets: [
            {
              type: "scatter-plot"
            }
          ]
        }
      ]
    }
  })

  function buildIcon(icon: string) {
    if (icon === "databse") {
      return <IconDatabase/>;
    } else if (icon === "plot") {
      return <IconChartBar/>;
    } else {
      console.log("Illegal icon:", icon);
    }
  }

  function buildWidget(widgetType: string) {
    if (widgetType === "table") {
      return <TableHandler store={store}/>;
    } else if (widgetType === "scatter-plot") {
      return <PlotHandler store={store}/>;
    } else {
      console.log("Illegal widgetType:", widgetType);
    }
  }

  function buildTabContents(tabConfigs: TabConfig[]) {
    return tabConfigs.map(tabConfig => {
      return {
        name: <span>{buildIcon(tabConfig.name.icon)} {tabConfig.name.text}</span>,
        component: <div>
          {tabConfig.widgets.map(widget => buildWidget(widget.type))}
        </div>
      }
    })
  }

  /*
  let tabContents = [
    {
      name: <span><IconDatabase/> Table </span>,
      component: <TableHandler store={store}/>,
    },
    {
      name: <span><IconChartBar/> Plot </span>,
      component: <PlotHandler store={store}/>,
    }
  ]
  */

  return (
    <Tabs contents={(buildTabContents(state.appstate.tabs))}/>
  )
}
