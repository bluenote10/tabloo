
import { StoreInterface, DataFetchOptions, TableData, clone } from "./store";

declare const TABLOO_COLUMN_DATA: string[]
declare const TABLOO_TABLE_DATA: TableData


export class StoreStandalone implements StoreInterface {

  async fetchColumns(): Promise<string[]> {
    return TABLOO_COLUMN_DATA;
  }

  async fetchData(opts: DataFetchOptions): Promise<TableData> {
    let data = TABLOO_TABLE_DATA; // clone(TABLOO_TABLE_DATA);
    console.log(data, opts)
    // TODO: implement handling of query parameters: filtering/sorting/...

    if (opts.sortKind === 0 || opts.sortColumn == null) {
      return data;
    } else {
      let sortColumn = data.find(colData => colData.columnName === opts.sortColumn!)!
      let toSort = sortColumn.values.map((x, i) => [x, i] as [number | string,  number]);
      toSort.sort((a, b) => (a < b) ? -1 * opts.sortKind : +1 * opts.sortKind);
      let sortIndices = toSort.map(xi => xi[1]);
      for (let i = 0; i < data.length; i++) {
        data[i].values = sortIndices.map(j => data[i].values[j])
        data[i].sortKind = (data[i].columnName === opts.sortColumn! ? opts.sortKind : 0)
      }
      console.log(data)
      return data;
    }
  }

}
