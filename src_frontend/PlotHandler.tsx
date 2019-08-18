import { createRoot, createState, createEffect, onCleanup, sample } from 'solid-js';

import { StoreInterface, DataFetchOptions, TableData, ColumnData } from "./store";
import { Dropdown } from "./Dropdown";

import * as echarts from "echarts";
import { ECharts } from "echarts";

declare global {
  namespace JSX {
    interface HTMLAttributes<T> {
      onconnected?: () => void
      ondisconnected?: () => void
    }
  }
}

export interface PlotWrapperProps {
  plotData?: any
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

  const [state, setState] = createState({
    mounted: false,
    cachedPlotData: null,
  })

  let updatePlot = (plotData: any) => {
    if (chart == null) {
      chart = echarts.init(el as HTMLDivElement);
    }
    console.log("updating plot with:", plotData)
    chart.setOption(plotData)
  }

  createEffect(() => {
    // effect to monitor changes to props.plotData
    let newPlotData = props.plotData;
    if (sample(() => state.mounted)) {
      // already mounted => we can call into the external lib directly
      updatePlot(newPlotData)
    } else {
      // not mounted => need to cache
      setState({cachedPlotData: newPlotData});
    }
  })

  let onMounted = () => {
    if (state.cachedPlotData != null) {
      updatePlot(state.cachedPlotData!)
      setState({cachedPlotData: null});
    }
    setState({mounted: true})
 }

  let onUnmounted = () => {
    setState({mounted: false})
  }

  return (
    <div
      ref={el}
      style="width: 600px;height:400px;"
      onconnected={onMounted}
      ondisconnected={onUnmounted}
    ></div>
  )
}


export function PlotHandler(props: {
    store: StoreInterface,
    filter: string,
    onSetFilter: (s: string) => void,
  }) {

  const { store } = props

  /*
  const dataFetchOptions = {
    sortKind: 0,
  } as DataFetchOptions
  */

  const [state, setState] = createState({
    columns: [] as string[],
    plotData: {} as any,
    selectedColX: undefined! as number,
    selectedColY: undefined! as number,
  })

  createEffect(() => {
    // handels updates of selected column indices
    let xCol = state.selectedColX;
    let yCol = state.selectedColY;
    let filter = props.filter;
    if (xCol != undefined && yCol != undefined) {
      fetchData(xCol, yCol, filter);
    }
  })

  async function fetchColumns() {
    let columns = await store.fetchColumns()
    console.log(columns)
    setState({columns: columns})

    if (columns.length >= 2) {
      setState({
        selectedColX: 0,
        selectedColY: 1,
      })
    }
  }

  async function fetchData(xCol: number, yCol: number, filter: string) {
    console.log(`Fetching data for columns ${xCol} vs ${yCol}`)
    let data = await store.fetchData({
      sortKind: 0,
      filter: filter,
    })

    const numCols = data.length;
    if (numCols === 0) {
      console.log("WARNING: received data with 0 columns, ignoring...");
      return;
    }
    const numRows = data[0].values.length;

    let rowsData = Array(numRows);
    for (let i=0; i<numRows; i++) {
      let rowData = Array(2);
      rowData[0] = data[xCol].values[i].toString();
      rowData[1] = data[yCol].values[i].toString();
      rowsData[i] = rowData;
    }

    // specify chart configuration item and data
    // https://echarts.baidu.com/echarts2/doc/doc-en.html
    let plotData = {
      //toolbox: {
      //  show: true,
      //},
      xAxis: {
        scale: true, // avoids axis range starts at zero
      },
      yAxis: {
        scale: true, // avoids axis range starts at zero
      },
      series: [{
        symbolSize: 5,
        data:rowsData,
        type: 'scatter'
      }]
    };
    setState({plotData: plotData as any}) // FIXME: Partial<any> doesn't seem to match specific types?
  }

  fetchColumns()

  let inputFilter: HTMLInputElement | undefined

  function onFilterKeydown(event: KeyboardEvent) {
    if (event.keyCode === 13 && inputFilter != undefined) {
      // Note we reset the currentPage to 0 immediately here, which
      // allows to run the fetchData in parallel (otherwise it would
      // fetch with a page number that is larger than the possible
      // page number with the new filter => returning no data).
      // We'll have to see if resetting the page number is what we
      // want on changing selections...
      props.onSetFilter(inputFilter.value.trim())
    }
  }

  createEffect(() => {
    let newFilter = props.filter;
    console.log("PlotHandler: filter updated to", newFilter);
    if (inputFilter != undefined) {
      inputFilter.value = newFilter;
    }
  })

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
            items={(state.columns)}
            selectedIndex={(state.selectedColX)}
            cbSelect={(index: number) => setState({selectedColX: index})}
          />
        </div>
        <div class="ui-form-row">
          <span class="ui-form-label">Dimension y</span>
          <Dropdown
            items={(state.columns)}
            selectedIndex={(state.selectedColY)}
            cbSelect={(index: number) => setState({selectedColY: index})}
          />
        </div>
      </div>
      <PlotWrapper plotData={(state.plotData)}/>
    </div>
  )
}