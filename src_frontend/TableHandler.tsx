import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

import { StoreInterface, StoreBackend, DataFetchOptions, TableData } from "./store";


export interface TableProps {
  data: TableData
}

function Table(props: TableProps) {
  return (
    <table>
      <thead>

      </thead>
      <tbody>

      </tbody>
    </table>
  )
}

export interface TableHandlerProps {
  store: StoreInterface
}

export function TableHandler(props: TableHandlerProps) {

  const { store } = props

  const [state, setState] = createState({
    tableData: [] as TableData,
    dataFetchOptions: {
      sortKind: 0
    } as DataFetchOptions,
  })

  async function fetchData() {
    let opts = state.dataFetchOptions as any as DataFetchOptions
    let data = await store.fetchData(opts)
    console.log(data)
    setState({tableData: data})
  }

  fetchData()

  return (
    <Table data={(state.tableData as any as TableData)}/>
  )
}