import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

import { StoreInterface, DataFetchOptions, TableData, ColumnData } from "./store";

import {
  IconLongArrowAltUp, IconLongArrowAltDown,
  IconSortAmountUp, IconSortAmountDown,
} from "./Icons";


type Value = string | number;

function transformToString(x: Value) {
  if (x != undefined) {
    return x.toString();
  } else {
    return "-"
  }
}

function transformFloatToString(digits: number, x: number) {
  if (x != undefined) {
    // TODO: handle limitations of toFixed
    return x.toFixed(digits);
  } else {
    return "-"
  }
}

interface ColumnFormatter {
  format: (x: Value) => string
  align: number
}

function analyzeColumn(data: Value[]): ColumnFormatter {
  let allNull = true;
  let allNumbers = true;
  let allInteger = true;
  let hasExponetials = false;

  let absMax = -Infinity;
  let absMin = +Infinity;

  let maxDecimalPlacesR = 0;
  let maxDecimalPlacesL = 0;

  for (let i=0; i<data.length; i++) {
    let value = data[i];

    if (value != undefined) {
      allNull = false;
    }

    if (typeof value === "string") {
      allNumbers = false;
      allInteger = false;
      break;
    } else if (typeof value === "number") {
      if (!Number.isInteger(value)) {
        allInteger = false;
      }

      let absValue = Math.abs(value as number)
      if (absValue > absMax) {
        absMax = absValue;
      }
      if (absValue < absMin) {
        absMin = absValue;
      }

      let valueString = (value > 0 ? value.toString() : (-value).toString());
      if (valueString.includes("e")) {
        hasExponetials = true;
        // TODO
      } else if (valueString.includes(".")) {
        let split = valueString.split(".");
        let decL = split[0].length;
        let decR = split[1].length;
        if (decL > maxDecimalPlacesL) {
          maxDecimalPlacesL = decL;
        }
        if (decR > maxDecimalPlacesR) {
          maxDecimalPlacesR = decR;
        }
      }
    }
  }
  // console.log(maxDecimalPlacesL, maxDecimalPlacesR)

  if (allNumbers && !allInteger && !hasExponetials) {
    let maxDigits = 6;
    let digits = maxDigits - maxDecimalPlacesL + 1;
    if (digits < 1) {
      digits = 1;
    }
    return {
      format: transformFloatToString.bind(null, digits) as (x: Value) => string,
      align: +1,
    }
  } else if (allInteger) {
    return {
      format: transformToString,
      align: +1,
    }
  } else {
    return {
      format: transformToString,
      align: -1,
    }
  }

}

/**
 * Transformation from columnar to row-wise data.
 */
function transformData(data: TableData): Value[][] {
  const numCols = data.length;
  if (numCols === 0) {
    return [];
  }
  const numRows = data[0].values.length;
  console.log(numRows, numCols);

  // we need to convert from columnar to row-wise data
  let rowsData = Array(numRows) as Value[][];
  for (let i=0; i<numRows; i++) {
    let rowData = Array(numCols) as Value[];
    for (let j=0; j<numCols; j++) {
      let value = data[j].values[i];
      rowData[j] = value;
    }
    rowsData[i] = rowData;
  }
  console.log(rowsData);
  return rowsData;
}

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
    rowsData: [] as Value[][],
    headerData: [] as ColHeader[],
    sortColIndex: undefined as (number | undefined),
    sortColKind: 0,
  })

  let columnFormatters = [] as ColumnFormatter[];

  createEffect(() => {
    console.log("Data updated", props.data)
    console.log("Data updated", props.data.length)
    const data = props.data
    if (data.length == 0) {
      return;
    }

    // update column formatters
    let numCols = data.length;
    columnFormatters.length = numCols;
    for (let j=0; j<numCols; j++) {
      columnFormatters[j] = analyzeColumn(data[j].values);
    }

    let rowsData = transformData(props.data);
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
        <IconLongArrowAltUp/>
        <IconLongArrowAltDown/>
      </>
    } else if (sortKind < 0) {
      return <IconSortAmountDown/>
    } else {
      return <IconSortAmountUp/>
    }
  }

  return (
    <table class={"table is-striped is-narrow is-hoverable is-bordered compact-table"}>
      <thead>
        <tr>
          <$ each={state.headerData}>
            {(colHeader: ColHeader, index: number) =>
              <th>
                <div class="column-header">
                  <span>
                    {colHeader.name}
                  </span>
                  <a
                    class="th-sort-symbol"
                    onclick={(event) => sortByCol(colHeader.name, index)}
                    onmousedown={(event) => event.preventDefault() /* to prevent header selection*/}
                  >
                    {(renderSymbol(colHeader.name, state.sortColIndex == index ? state.sortColKind : 0))}
                  </a>
                </div>
              </th>
            }
          </$>
        </tr>
      </thead>
      <tbody>
        <$ each={state.rowsData} fallback={<div>empty</div>}>
          { (row: string[]) =>
            <tr>
              <$ each={row} fallback={<div>empty</div>}>
                { (x: Value, j: number) =>
                  <td class={(columnFormatters[j].align > 0 ? "has-text-right" : undefined)}>{columnFormatters[j].format(x)}</td>
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