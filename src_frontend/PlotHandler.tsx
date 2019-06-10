import { createRoot, createState, createEffect, onCleanup, sample } from 'solid-js';

import { StoreInterface, StoreBackend, DataFetchOptions, TableData, ColumnData } from "./store";

import * as echarts from "echarts";
import { ECharts } from "echarts";

import * as _ from 'babel-plugin-jsx-dom-expressions'

// https://github.com/ryansolid/babel-plugin-jsx-dom-expressions/pull/10
declare const $: (attr: {
  children?: {}
  each?: unknown[]
  when?: boolean
  suspend?: boolean
  fallback?: unknown
  portal?: unknown
  useShadow?: boolean
  provide?: {
    id: symbol
    initFn: () => any
  }
  value?: any
  afterRender?: () => unknown
}) => any

/*
// Eventually we could use something like this
function PlotWrapper(props) {
  let el;

  const [state, setState] = createState({
    mounted: false,
    cachedPlotData: null,
  })

  createEffect(() => {
    // effect to monitor changes to props.plotData
    let newPlotData = props.plotData;
    if (sample(() => state.mounted)) {
      // already mounted => we can call into the external lib directly
      plottingLibrary.plot(el, newPlotData);
    } else {
      // not mounted => need to cache
      setState({cachedPlotData: newPlotData});
    }
  })

  onMounted(() => {
    if (state.cachedPlotData != null) {
      plottingLibrary.plot(el, state.cachedPlotData);
      setState({cachedPlotData: null});
    }
    setState({mounted: true})
 }

  onUnmounted(() => {
    setState({mounted: false})
  }

  return <div ref={el}></div>
}
*/

export interface PlotWrapperProps {
  plotData?: any
}

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

  return <div ref={el} style="width: 600px;height:400px;"></div>
}


export interface PlotHandlerProps {
  store: StoreInterface
}

export function PlotHandler(props: PlotHandlerProps) {

  const { store } = props

  const dataFetchOptions = {
    sortKind: 0,
  } as DataFetchOptions

  const [state, setState] = createState({
    tableData: [] as TableData,
    plotData: {} as any,
  })

  async function fetchData() {
    let data = await store.fetchData({
      sortKind: 0
    })
    console.log(data)

    const numCols = data.length;
    const numRows = data[0].values.length;
    console.log(numRows, numCols);

    let rowsData = Array(numRows);
    for (let i=0; i<numRows; i++) {
      let rowData = Array(2);
      rowData[0] = data[1].values[i].toString();
      rowData[1] = data[2].values[i].toString();
      rowsData[i] = rowData;
    }
    console.log(rowsData);

    // specify chart configuration item and data
    let plotData = {
      xAxis: {},
      yAxis: {},
      series: [{
        symbolSize: 5,
        data:rowsData,
        type: 'scatter'
      }]
    };
    setState({plotData: plotData} as any) // FIXME: why cast needed?
  }

  fetchData()

  return <PlotWrapper plotData={(state.plotData)}/>
}