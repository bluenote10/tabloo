import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

import { StoreInterface, StoreBackend, DataFetchOptions, TableData, ColumnData } from "./store";

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


export interface TableProps {
  data: TableData,
  cbSort: (sortKind: number, columnIndex?: number) => void,
}

interface ColHeader {
  name: string,
  sortKind: number,
}

function Table(props: TableProps) {

  const [state, setState] = createState({
    rowsData: [] as string[][],
    headerData: [] as ColHeader[],
    sortColIndex: undefined as (number | undefined),
    sortColKind: 0,
  })

  createEffect(() => {
    console.log("Data updated", props.data)
    console.log("Data updated", props.data.length)
    const data = props.data
    if (data.length == 0) {
      return;
    }

    const numCols = data.length;
    const numRows = data[0].values.length;
    console.log(numRows, numCols);

    // we need to convert from columnar to row-wise data
    let rowsData = Array(numRows);
    for (let i=0; i<numRows; i++) {
      let rowData = Array(numCols);
      for (let j=0; j<numCols; j++) {
        let value = data[j].values[i];
        rowData[j] = (value != undefined ? value.toString() : "");
      }
      rowsData[i] = rowData;
    }
    console.log(rowsData);

    setState({rowsData: rowsData})

    let headerData = data.map((x: ColumnData) => ({
      name: x.columnName,
      sortKind: x.sortKind,
      //onsort: () => { this.props.onsort(x.columnName) }
    }))
    setState({headerData: headerData})

  })

  createEffect(() => {
    console.log("Rowsdata updated", state.rowsData)
    console.log("Rowsdata updated", state.rowsData.length)
  })

  createEffect(() => {
    console.log("headerData updated", state.headerData)
    console.log("headerData updated", state.headerData.length)
  })

  createEffect(() => {
    console.log("Updated sortColIndex", state.sortColIndex)
  })
  createEffect(() => {
    console.log("Updated sortColKind", state.sortColKind)
  })

  function sortByCol(name: string, index: number) {
    console.log("Sorting by column:", name, index, state.sortColIndex, state.sortColKind)
    if (state.sortColIndex !== index || state.sortColKind == 0) {
      props.cbSort(1, index)
      setState({
        sortColIndex: index,
        sortColKind: 1,
      })
    } else {
      if (state.sortColKind == 1) {
        props.cbSort(-1, index)
        setState({
          sortColKind: -1,
        })
      } else {
        props.cbSort(0, undefined)
        setState({
          sortColKind: 0,
        })
      }
    }
  }

  function renderSymbol(name: string, sortKind: number) {
    if (sortKind == 0) {
      return <>
        <i class="fas fa-long-arrow-alt-up"></i>
        <i class="fas fa-long-arrow-alt-down"></i>
      </>
    } else if (sortKind < 0) {
      return <i class="fas fa-sort-amount-down"></i>
    } else {
      return <i class="fas fa-sort-amount-up"></i>
    }
  }

  return (
    <table class={"table is-striped is-narrow is-hoverable compact-table"}>
      <thead>
        <$ each={state.headerData}>
          {(colHeader: ColHeader, index: number) =>
            <th>
              {colHeader.name}
              <a onclick={(event) => sortByCol(colHeader.name, index)}>
              {(renderSymbol(colHeader.name, state.sortColIndex == index ? state.sortColKind : 0))}
              </a>
            </th>
          }
        </$>
      </thead>
      <tbody>
        <$ each={state.rowsData} fallback={<div>empty</div>}>
          { (row: string[]) =>
            <tr>
              <$ each={row} fallback={<div>empty</div>}>
                { (item: string) =>
                  <td>{item}</td>
                }
              </$>
            </tr>
          }
        </$>
      </tbody>
    </table>
  )
}

export interface TableHandlerProps {
  store: StoreInterface
}

export function TableHandler(props: TableHandlerProps) {

  const { store } = props

  const dataFetchOptions = {
    sortKind: 0,
  } as DataFetchOptions

  const [state, setState] = createState({
    tableData: [] as TableData,
  })

  async function fetchData() {
    let opts = dataFetchOptions
    let data = await store.fetchData(opts)
    console.log(data)
    setState({tableData: data})
  }

  fetchData()

  function cbSort(sortKind: number, columnIndex?: number) {
    if (columnIndex != null) {
      dataFetchOptions.sortColumn = state.tableData[columnIndex].columnName
    }
    dataFetchOptions.sortKind = sortKind
    fetchData()
  }

  return (
    <Table data={(state.tableData)} cbSort={cbSort}/>
  )
}