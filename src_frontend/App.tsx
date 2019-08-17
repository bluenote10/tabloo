
import { createState, createEffect, createMemo } from 'solid-js';
import { For } from 'solid-js/dom';

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
    },
    activeTabIndex: 0,
    tabHeaders: [] as JSX.Element[],
    tabContents: [] as JSX.Element[],
  })

  function buildIcon(icon: string) {
    if (icon === "database") {
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
      return <div>{"Illegal widgetType: " + widgetType}</div>
    }
  }

  /*
  function buildTabContents(tabConfigs: TabConfig[]) {
    console.log("building tab contents")
    return tabConfigs.map(tabConfig => {
      return {
        name: <span>{buildIcon(tabConfig.name.icon)} {tabConfig.name.text}</span>,
        component: <div>
          {tabConfig.widgets.map(widget => buildWidget(widget.type))}
        </div>
      }
    })
  }
  */

  createEffect(() => {
    let tabs = state.appstate.tabs;
    let newTabHeaders = tabs.map(tabConfig =>
      <span>{buildIcon(tabConfig.name.icon)} {tabConfig.name.text}</span>
    )
    setState({
      tabHeaders: newTabHeaders
    })
  })

  let tabContents = (
    <For each={(state.appstate.tabs)}>{ tab =>
      <For each={(tab.widgets)}>{ widget =>
        buildWidget(widget.type)
      }</For>
    }</For>
  ) as () => JSX.Element[]

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

  createEffect(() => {
    console.log("tabs updated:", state.appstate.tabs)
  })

  //let tabContentsMemo = createMemo(() => buildTabContents2());

  function onActivate(i: number) {
    setState({activeTabIndex: i})
  }

  return (
    <>
      <Tabs activeIndex={state.activeTabIndex} contents={(state.tabHeaders)} onActivate={onActivate}/>
      <div class="ui-padded-container">
        <div class="container">
          {( tabContents()[state.activeTabIndex] )}
        </div>
      </div>
    </>
  )
}
