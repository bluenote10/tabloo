import { JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { For, Switch, Match } from "solid-js/web";

import { StoreInterface } from "./store";

import { Tabs } from "./Tabs";
import { TableHandler } from "./TableHandler";
import { PlotHandler } from "./PlotHandler";

import { IconDatabase, IconChartBar } from "./Icons";

interface TabConfig {
  name: {
    icon: string;
    text: string;
  };
  widgets: WidgetConfig[];
}

interface WidgetConfig {
  type: string;
  filterId: string;
}

function buildIcon(icon: string) {
  if (icon === "database") {
    return <IconDatabase />;
  } else if (icon === "plot") {
    return <IconChartBar />;
  } else {
    return <span>?</span>;
  }
}

export function App({ store }: { store: StoreInterface }) {
  const [state, setState] = createStore({
    appstate: {
      tabs: [
        {
          name: {
            icon: "database",
            text: "Table",
          },
          widgets: [
            {
              type: "table",
              filterId: "default",
            },
          ],
        },
        {
          name: {
            icon: "plot",
            text: "Plots",
          },
          widgets: [
            {
              type: "scatter-plot",
              filterId: "default",
            },
          ],
        },
      ] as TabConfig[],
      filters: {
        default: "",
      } as { [index: string]: string },
    },
    activeTabIndex: 0,
  });

  const tabHeaders = (
    <For each={state.appstate.tabs}>
      {(tab) => (
        <span>
          {buildIcon(tab.name.icon)} {tab.name.text}
        </span>
      )}
    </For>
  ) as () => JSX.Element[];

  const tabContents = (
    <For each={state.appstate.tabs}>
      {(tab) => (
        <For each={tab.widgets}>
          {(widget) => (
            <Switch>
              <Match when={widget.type === "table"}>
                <TableHandler
                  store={store}
                  filter={state.appstate.filters[widget.filterId]}
                  onSetFilter={(s) => {
                    setState("appstate", "filters", widget.filterId, s);
                  }}
                />
              </Match>
              <Match when={widget.type === "scatter-plot"}>
                <PlotHandler
                  store={store}
                  filter={state.appstate.filters[widget.filterId]}
                  onSetFilter={(s) => {
                    setState("appstate", "filters", widget.filterId, s);
                  }}
                />
              </Match>
              <Match when={true}>
                <div class="ui-widget-header">{"Illegal widget.type: " + widget.type}</div>
              </Match>
            </Switch>
          )}
        </For>
      )}
    </For>
  ) as () => JSX.Element[];

  function onActivate(i: number) {
    setState({ activeTabIndex: i });
  }

  return (
    <>
      <Tabs activeIndex={state.activeTabIndex} tabHeaders={tabHeaders()} onActivate={onActivate} />
      <div class="ui-padded-container">
        <div class="container">{tabContents()[state.activeTabIndex]}</div>
      </div>
    </>
  );
}
