import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

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


export interface PlotHandlerProps {
  store: StoreInterface
}

export function PlotHandler(props: PlotHandlerProps) {

  const { store } = props

  let plot = <div style="width: 600px;height:400px;"></div>
  //let chart: ECharts = echarts.init(plot as HTMLDivElement);
  let chart: ECharts

  const dataFetchOptions = {
    sortKind: 0,
  } as DataFetchOptions

  const [state, setState] = createState({
    tableData: [] as TableData,
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
    let option = {
      xAxis: {},
      yAxis: {},
      series: [{
        symbolSize: 5,
        data:rowsData,
        type: 'scatter'
      }]
    };
    chart = echarts.init(plot as HTMLDivElement);
    setTimeout(() =>
      chart.setOption(option), 2000)
  }

  fetchData()

  onCleanup(() => {
    console.log("onCleanup of plot")
  })

  return (
    plot
  )
}