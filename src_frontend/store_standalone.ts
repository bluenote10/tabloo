import { StoreInterface, DataFetchOptions, TableData, clone } from "./store";

declare const TABLOO_COLUMN_DATA: string[];
declare const TABLOO_TABLE_DATA: TableData;

export class StoreStandalone implements StoreInterface {
  async fetchColumns(): Promise<string[]> {
    return TABLOO_COLUMN_DATA;
  }

  async fetchNumPages(
    _paginationSize: number,
    _filter?: string
  ): Promise<number> {
    // TODO
    return 0;
  }

  async fetchData(opts: DataFetchOptions): Promise<TableData> {
    const data = clone(TABLOO_TABLE_DATA);

    if (opts.sortColumn == null || opts.sortKind === 0) {
      return data;
    } else {
      const sortColumn = data.find(
        (colData) => colData.columnName === opts.sortColumn
      )!; // TODO: Handle null
      const toSort = sortColumn.values.map(
        (x, i) => [x, i] as [number | string, number]
      );
      toSort.sort((a, b) => {
        const valA = a[0];
        const valB = b[0];
        if (valA < valB) {
          return -1 * opts.sortKind;
        } else if (valA > valB) {
          return +1 * opts.sortKind;
        } else {
          return (a[1] < b[1] ? -1 : +1) * opts.sortKind;
        }
      });
      const sortIndices = toSort.map((xi) => xi[1]);
      for (let i = 0; i < data.length; i++) {
        data[i].values = sortIndices.map((j) => data[i].values[j]);
        data[i].sortKind =
          data[i].columnName === opts.sortColumn ? opts.sortKind : 0;
      }
      return data;
    }
  }
}
