
import axios from 'axios';
import * as fn from "./fn";

export interface ColumnData {
  columnName: string;
  sortKind: number;
  values: string[];
}
export type TableData = ColumnData[]

export interface DataFetchOptions {
  sortColumn?: string
  sortKind: number
}

export interface StoreInterface {
  //async fetchData(): void
  fetchColumns(): Promise<string[]>
  fetchData(opts: DataFetchOptions): Promise<TableData>
}


export class StoreBackend implements StoreInterface {
  url = "http://localhost:5000"

  async fetchColumns(): Promise<string[]> {
    let response = await axios.get(`${this.url}/api/get_columns`)
    return response.data as string[];
  }

  async fetchData(opts: DataFetchOptions): Promise<TableData> {
    let response = await axios.get(`${this.url}/api/get_data`, {
      params: opts
    })
    console.log("Received response...");
    /*
    let tableData = response.data;
    console.log(tableData)
    let transformedData = fn.mapEntries(tableData, (k, v) => ({
      columnName: k,
      values: v as string[],
    }))
    console.log(transformedData)
    */
    if (typeof response.data === "string") {
      // Ugly axios bug: It swallows JSON.parse exceptions...
      // https://github.com/axios/axios/issues/1723
      // Try explicit parse to see exception...
      let parsed = JSON.parse(response.data) as TableData;
      return parsed;
    }
    let parsed = response.data as TableData;
    return parsed;
  }

}
