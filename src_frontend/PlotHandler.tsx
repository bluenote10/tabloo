import {
  createRoot,
  createEffect,
  onCleanup,
  untrack,
  onMount,
} from "solid-js";
import { createStore } from "solid-js/store";

import {
  StoreInterface,
  DataFetchOptions,
  TableData,
  ColumnData,
} from "./store";
import { Dropdown } from "./Dropdown";

import * as echarts from "echarts";
import { ECharts } from "echarts";

export interface PlotWrapperProps {
  plotData?: any;
}

/*
function PlotWrapper(props: PlotWrapperProps) {
  let el: HTMLDivElement = null!;
  let chart: ECharts = null!;

  const [state, setState] = createState({
    cachedPlotData: null,
  })

  createEffect(() => {
    // effect to monitor changes to props.plotData
    let newPlotData = props.plotData;

    if (newPlotData != null) {
      setState({cachedPlotData: newPlotData});
    }
  })

  setInterval(() => {
    if (chart == null) {
      chart = echarts.init(el as HTMLDivElement);
    }

    if (state.cachedPlotData != null && document.body.contains(el)) {
      chart.setOption(state.cachedPlotData!)
      setState({cachedPlotData: null})
    }
    document.body.contains(el)
  }, 100)

  return (
    <div
      ref={el}
      style="width: 600px;height:400px;"
    ></div>
  )
}
*/

function PlotWrapper(props: PlotWrapperProps) {
  let el: HTMLDivElement = null!;
  let chart: ECharts = null!;

  const [state, setState] = createStore({
    mounted: false,
    cachedPlotData: null,
  });

  let updatePlot = (plotData: any) => {
    if (chart == null) {
      chart = echarts.init(el as HTMLDivElement, { locale: "EN" });
    }
    console.log("updating plot with:", plotData);
    chart.setOption(plotData);
  };

  onMount(() => {
    (el as any).onconnected = onMounted;
    (el as any).ondisconnected = onUnmounted;
  });

  createEffect(() => {
    // effect to monitor changes to props.plotData
    let newPlotData = props.plotData;
    if (untrack(() => state.mounted)) {
      // already mounted => we can call into the external lib directly
      updatePlot(newPlotData);
    } else {
      // not mounted => need to cache
      setState({ cachedPlotData: newPlotData });
    }
  });

  let onMounted = () => {
    if (state.cachedPlotData != null) {
      updatePlot(state.cachedPlotData!);
      setState({ cachedPlotData: null });
    }
    setState({ mounted: true });
  };

  let onUnmounted = () => {
    setState({ mounted: false });
  };

  return (
    <div
      ref={el}
      style="width: 800px;height:600px;"
      // onconnected={onMounted}
      // ondisconnected={onUnmounted}
    ></div>
  );
}

export function PlotHandler(props: {
  store: StoreInterface;
  filter: string;
  onSetFilter: (s: string) => void;
}) {
  const { store } = props;

  /*
  const dataFetchOptions = {
    sortKind: 0,
  } as DataFetchOptions
  */

  const [state, setState] = createStore({
    columns: [] as string[],
    plotData: {} as any,
    selectedColX: undefined! as number,
    selectedColY: undefined! as number,
  });

  createEffect(() => {
    // handles updates of selected column indices
    let xCol = state.selectedColX;
    let yCol = state.selectedColY;
    let filter = props.filter;
    if (xCol != undefined && yCol != undefined) {
      fetchData(xCol, yCol, filter);
    }
  });

  async function fetchColumns() {
    let columns = await store.fetchColumns();
    console.log(columns);
    setState({ columns: columns });

    if (columns.length >= 2) {
      setState({
        selectedColX: 0,
        selectedColY: 1,
      });
    }
  }

  async function fetchData(xCol: number, yCol: number, filter: string) {
    console.log(`Fetching data for columns ${xCol} vs ${yCol}`);
    let data = await store.fetchData({
      sortKind: 0,
      filter: filter,
    });

    const numCols = data.length;
    if (numCols === 0) {
      console.log("WARNING: received data with 0 columns, ignoring...");
      return;
    }
    const numRows = data[0].values.length;

    const valueConverter = (x: any) => {
      if (x == undefined || x === "inf" || x === "-inf" || !isFinite(x)) {
        return NaN;
      } else {
        return x; // TODO: do we need to convert to string for categorical data?
      }
    };

    let rowsData = Array(numRows);
    for (let i = 0; i < numRows; i++) {
      let rowData = Array(2);
      rowData[0] = valueConverter(data[xCol].values[i]);
      rowData[1] = valueConverter(data[yCol].values[i]);
      rowsData[i] = rowData;
    }

    // specify chart configuration item and data
    // https://echarts.baidu.com/echarts2/doc/doc-en.html
    let plotData = {
      //toolbox: {
      //  show: true,
      //},
      tooltip: {
        // trigger: 'axis',
        showContent: false,
        showDelay: 0,
        axisPointer: {
          show: true,
          type: "cross",
          lineStyle: {
            type: "dashed",
            width: 1,
          },
        },
      },
      toolbox: {
        feature: {
          dataZoom: {},
          brush: {
            type: ["rect", "polygon", "lineX", "lineY", "clear"],
          },
          saveAsImage: {
            show: true,
            title: "Save As Image",
            pixelRatio: 2,
          },
          //restore: {}
        },
        top: "20px",
        right: "80px",
      },
      brush: {
        // seems to be necessary to set to empty for box zoom to work...
      },
      xAxis: {
        scale: true, // avoids axis range starts at zero
      },
      yAxis: {
        scale: true, // avoids axis range starts at zero
      },
      series: [
        {
          symbolSize: 5,
          data: rowsData,
          type: "scatter",
        },
      ],
    };
    setState({ plotData: plotData as any }); // FIXME: Partial<any> doesn't seem to match specific types?
  }

  fetchColumns();

  let inputFilter: HTMLInputElement | undefined;

  function onFilterKeydown(event: KeyboardEvent) {
    if (event.keyCode === 13 && inputFilter != undefined) {
      props.onSetFilter(inputFilter.value.trim());
    }
  }

  createEffect(() => {
    let newFilter = props.filter;
    console.log("PlotHandler: filter updated to", newFilter);
    if (inputFilter != undefined) {
      inputFilter.value = newFilter;
    }
  });

  return (
    <div>
      <div class="ui-widget-header">
        <div class="ui-form-row">
          <span class="ui-form-label">Filter</span>
          <input
            class="input is-small ui-form-input"
            placeholder="Filter..."
            onkeydown={onFilterKeydown}
            ref={inputFilter}
          />
        </div>
        <div class="ui-form-row">
          <span class="ui-form-label">Dimension x</span>
          <Dropdown
            items={state.columns}
            selectedIndex={state.selectedColX}
            cbSelect={(index: number) => setState({ selectedColX: index })}
          />
        </div>
        <div class="ui-form-row">
          <span class="ui-form-label">Dimension y</span>
          <Dropdown
            items={state.columns}
            selectedIndex={state.selectedColY}
            cbSelect={(index: number) => setState({ selectedColY: index })}
          />
        </div>
      </div>
      <PlotWrapper plotData={state.plotData} />
    </div>
  );
}
