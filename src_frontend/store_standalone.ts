
import { StoreInterface, DataFetchOptions, TableData } from "./store";

declare const TABLOO_COLUMN_DATA: string[]
declare const TABLOO_TABLE_DATA: TableData


export class StoreStandalone implements StoreInterface {

  async fetchColumns(): Promise<string[]> {
    return TABLOO_COLUMN_DATA;
  }

  async fetchData(opts: DataFetchOptions): Promise<TableData> {
    let data = TABLOO_TABLE_DATA;
    // TODO: implement handling of query parameters: filtering/sorting/...
    return data;
  }

}
