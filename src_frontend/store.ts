
export interface ColumnData {
  columnName: string;
  sortKind: number;
  values: Array<string|number>;
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
