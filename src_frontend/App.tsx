
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


function buildIcon(icon: string) {
  if (icon === "database") {
    return <IconDatabase/>;
  } else if (icon === "plot") {
    return <IconChartBar/>;
  } else {
    return <span>?</span>
  }
}

function buildWidget(widgetType: string, store: StoreInterface) {
  if (widgetType === "table") {
    return <TableHandler store={store}/>;
  } else if (widgetType === "scatter-plot") {
    return <PlotHandler store={store}/>;
  } else {
    return <div>{"Illegal widgetType: " + widgetType}</div>
  }
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
            },
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
            },
          ]
        }
      ] as TabConfig[]
    },
    activeTabIndex: 0,
  })

  let tabHeaders = (
    <For each={(state.appstate.tabs)}>{tab =>
      <span>{buildIcon(tab.name.icon)} {tab.name.text}</span>
    }</For>
  ) as () => JSX.Element[]

  let tabContents = (
    <For each={(state.appstate.tabs)}>{ tab =>
      <For each={(tab.widgets)}>{ widget =>
        buildWidget(widget.type, store)
      }</For>
    }</For>
  ) as () => JSX.Element[]

  function onActivate(i: number) {
    setState({activeTabIndex: i})
  }

  return (
    <>
      <Tabs activeIndex={(state.activeTabIndex)} tabHeaders={(tabHeaders())} onActivate={onActivate}/>
      <div class="ui-padded-container">
        <div class="container">
          {( tabContents()[state.activeTabIndex] )}
        </div>
      </div>
    </>
  );
}
