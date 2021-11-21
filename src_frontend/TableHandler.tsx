import { createRoot, createEffect, onCleanup, untrack } from "solid-js";
import { createStore } from "solid-js/store";
import { For } from "solid-js/web";

import {
  StoreInterface,
  DataFetchOptions,
  TableData,
  ColumnData,
} from "./store";

import {
  IconLongArrowAltUp,
  IconLongArrowAltDown,
  IconSortAmountUp,
  IconSortAmountDown,
} from "./Icons";

type Value = string | number;

function transformToString(x: Value) {
  if (x != undefined) {
    return x.toString();
  } else {
    return "-";
  }
}

function transformFloatToString(digits: number, x: number) {
  if (x != undefined) {
    // TODO: handle limitations of toFixed
    return x.toFixed(digits);
  } else {
    return "-";
  }
}

interface ColumnFormatter {
  format: (x: Value) => string;
  align: number;
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

  for (let i = 0; i < data.length; i++) {
    const value = data[i];

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

      const absValue = Math.abs(value as number);
      if (absValue > absMax) {
        absMax = absValue;
      }
      if (absValue < absMin) {
        absMin = absValue;
      }

      const valueString = value > 0 ? value.toString() : (-value).toString();
      if (valueString.includes("e")) {
        hasExponetials = true;
        // TODO
      } else if (valueString.includes(".")) {
        const split = valueString.split(".");
        const decL = split[0].length;
        const decR = split[1].length;
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
    const maxDigits = 6;
    let digits = maxDigits - maxDecimalPlacesL + 1;
    if (digits < 1) {
      digits = 1;
    }
    return {
      format: transformFloatToString.bind(null, digits) as (x: Value) => string,
      align: +1,
    };
  } else if (allInteger) {
    return {
      format: transformToString,
      align: +1,
    };
  } else {
    return {
      format: transformToString,
      align: -1,
    };
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
  console.log("Transforming data of shape:", numRows, numCols);

  // we need to convert from columnar to row-wise data
  const rowsData = Array(numRows) as Value[][];
  for (let i = 0; i < numRows; i++) {
    const rowData = Array(numCols) as Value[];
    for (let j = 0; j < numCols; j++) {
      const value = data[j].values[i];
      rowData[j] = value;
    }
    rowsData[i] = rowData;
  }
  return rowsData;
}

interface ColHeader {
  name: string;
  sortKind: number;
}

function Table(props: {
  data: TableData;
  cbSort: (sortKind: number, columnIndex?: number) => void;
}) {
  const [state, setState] = createStore({
    rowsData: [] as Value[][],
    headerData: [] as ColHeader[],
    sortColIndex: undefined as number | undefined,
    sortColKind: 0,
  });

  const columnFormatters = [] as ColumnFormatter[];

  createEffect(() => {
    console.log("Data updated", props.data.length);
    const data = props.data;
    if (data.length == 0) {
      return;
    }

    // update column formatters
    const numCols = data.length;
    columnFormatters.length = numCols;
    for (let j = 0; j < numCols; j++) {
      columnFormatters[j] = analyzeColumn(data[j].values);
    }

    const rowsData = transformData(props.data);
    setState({ rowsData: rowsData });

    const headerData = data.map((x: ColumnData) => ({
      name: x.columnName,
      sortKind: x.sortKind,
      //onsort: () => { this.props.onsort(x.columnName) }
    }));
    setState({ headerData: headerData });
  });

  createEffect(() => {
    console.log("Rowsdata updated", state.rowsData.length);
  });

  createEffect(() => {
    console.log("headerData updated", state.headerData.length);
  });

  createEffect(() => {
    console.log("Updated sortColIndex", state.sortColIndex);
  });
  createEffect(() => {
    console.log("Updated sortColKind", state.sortColKind);
  });

  function sortByCol(name: string, index: number) {
    console.log(
      "Sorting by column:",
      name,
      index,
      state.sortColIndex,
      state.sortColKind
    );
    if (state.sortColIndex !== index || state.sortColKind == 0) {
      props.cbSort(1, index);
      setState({
        sortColIndex: index,
        sortColKind: 1,
      });
    } else {
      if (state.sortColKind == 1) {
        props.cbSort(-1, index);
        setState({
          sortColKind: -1,
        });
      } else {
        props.cbSort(0, undefined);
        setState({
          sortColKind: 0,
        });
      }
    }
  }

  function renderSymbol(name: string, sortKind: number) {
    if (sortKind == 0) {
      return (
        <>
          <IconLongArrowAltUp />
          <IconLongArrowAltDown />
        </>
      );
    } else if (sortKind < 0) {
      return <IconSortAmountDown />;
    } else {
      return <IconSortAmountUp />;
    }
  }

  function onCopy(event: ClipboardEvent) {
    // https://jsbin.com/runomuheye/1/edit?html,css,js,output
    // http://jsfiddle.net/vello/qvw0pgcu/
    console.log("Handling copy event");
    const clipboardData = event.clipboardData;
    // TODO...
    /*
    if (clipboardData != null) {
      clipboardData.setData("text", "table data...");
      event.preventDefault();
    }
    */
  }

  return (
    <table
      class={
        "table is-striped is-narrow is-hoverable is-bordered compact-table"
      }
      oncopy={onCopy}
    >
      <thead>
        <tr>
          <For each={state.headerData}>
            {(colHeader: ColHeader, index: () => number) => (
              <th>
                <div class="column-header">
                  <span class="truncate">{colHeader.name}</span>
                  <a
                    class="th-sort-symbol"
                    onclick={(event) => sortByCol(colHeader.name, index())}
                    onmousedown={
                      (event) =>
                        event.preventDefault() /* to prevent header selection*/
                    }
                  >
                    {renderSymbol(
                      colHeader.name,
                      state.sortColIndex == index() ? state.sortColKind : 0
                    )}
                  </a>
                </div>
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For
          each={
            state.rowsData as string[][] /* FIXME, why does the wrapper type fail with nested array? */
          }
          fallback={<div>No data</div>}
        >
          {(row: string[]) => (
            <tr>
              <For each={row}>
                {(x: Value, j: () => number) => (
                  <td
                    class={
                      "truncate " +
                      (columnFormatters[j()].align > 0
                        ? "has-text-right"
                        : undefined)
                    }
                  >
                    {columnFormatters[j()].format(x)}
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

interface PaginationData {
  numPages: number;
  currentPage: number;
  onPaginate: (i: number) => void;
}

function Pagination(props: PaginationData) {
  function constructPageArray(
    n: number,
    current: number
  ): Array<number | undefined> {
    if (n <= 10) {
      return Array.from(Array(props.numPages).keys());
    } else {
      if (current <= 2) {
        return [0, 1, 2, 3, undefined, n - 1];
      } else if (current >= n - 3) {
        return [0, undefined, n - 4, n - 3, n - 2, n - 1];
      } else {
        return [
          0,
          undefined,
          current - 1,
          current,
          current + 1,
          undefined,
          n - 1,
        ];
      }
    }
  }

  return (
    <nav class="pagination is-small">
      <ul class="pagination-list">
        <For each={constructPageArray(props.numPages, props.currentPage)}>
          {(i) => {
            if (typeof i === "number") {
              return (
                <li>
                  <a
                    class={
                      "pagination-link" +
                      (i === props.currentPage ? " is-current" : "")
                    }
                    onclick={() => props.onPaginate(i)}
                  >
                    {i + 1}
                  </a>
                </li>
              );
            } else {
              return (
                <li>
                  <span class="pagination-ellipsis">&hellip;</span>
                </li>
              );
            }
          }}
        </For>
      </ul>
    </nav>
  );
}

export function TableHandler(props: {
  store: StoreInterface;
  filter: string;
  onSetFilter: (s: string) => void;
}) {
  const { store } = props;

  const [state, setState] = createStore({
    tableData: [] as TableData,
    sortKind: 0,
    sortColumn: undefined as string | undefined,
    pagination: {
      numPages: 0,
      currentPage: 0,
    },
  });

  initialize();

  async function initialize() {
    await fetchNumPages();
    await fetchData();
  }

  async function fetchNumPages() {
    const numPages = await store.fetchNumPages(20, props.filter);
    console.log("num pages:", numPages);
    setState({
      pagination: {
        numPages: numPages,
        currentPage: 0,
      },
    });
  }

  async function fetchData() {
    const dataFetchOptions = {
      sortKind: state.sortKind,
      sortColumn: state.sortColumn,
      paginationSize: 20,
      page: state.pagination.currentPage,
      filter: props.filter,
    };
    const data = await store.fetchData(dataFetchOptions);
    setState({ tableData: data });
  }

  function cbSort(sortKind: number, columnIndex?: number) {
    setState({ sortKind: sortKind });
    if (columnIndex != null) {
      setState({ sortColumn: state.tableData[columnIndex].columnName });
    }
    fetchData();
  }

  let inputFilter: HTMLInputElement | undefined;

  function onFilterKeydown(event: KeyboardEvent) {
    if (event.keyCode === 13 && inputFilter != undefined) {
      // Note we reset the currentPage to 0 immediately here, which
      // allows to run the fetchData in parallel (otherwise it would
      // fetch with a page number that is larger than the possible
      // page number with the new filter => returning no data).
      // We'll have to see if resetting the page number is what we
      // want on changing selections...
      props.onSetFilter(inputFilter.value.trim());
      setState({
        pagination: {
          currentPage: 0,
          numPages: state.pagination.numPages,
        },
      });
    }
  }

  createEffect(() => {
    const newFilter = props.filter;
    console.log("TableHandler: filter updated to", newFilter);
    if (inputFilter != undefined) {
      inputFilter.value = newFilter;
    }
    // TODO: clarify why not sampling here causes an infinite loop.
    // Interestingly running either fetchNumPages or fetchDat alone is fine.
    // Only the combination causes an infinite loop.
    untrack(() => {
      fetchNumPages();
      fetchData();
    });
  });

  function onPaginate(i: number) {
    setState({
      pagination: {
        currentPage: i,
        numPages: state.pagination.numPages,
      },
    });
    fetchData();
  }

  return (
    <>
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
      </div>
      <div class="ui-table-wrapper">
        <Table data={state.tableData} cbSort={cbSort} />
      </div>
      <Pagination
        numPages={state.pagination.numPages}
        currentPage={state.pagination.currentPage}
        onPaginate={onPaginate}
      />
    </>
  );
}
