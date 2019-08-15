
export interface ColumnData {
  columnName: string;
  sortKind: number;
  values: Array<string|number>;
}
export type TableData = ColumnData[]

export interface DataFetchOptions {
  sortColumn?: string
  sortKind: number
  paginationSize?: number
  page?: number
  filter?: string
}

export interface StoreInterface {
  //async fetchData(): void
  fetchColumns(): Promise<string[]>
  fetchNumPages(paginationSize: number, filter?: string): Promise<number>
  fetchData(opts: DataFetchOptions): Promise<TableData>
}

export function clone(data: TableData): TableData {
  let newData = [...Array(data.length)].map((x, i) => ({
    columnName: data[i].columnName,
    sortKind: data[i].sortKind,
    values: data[i].values.slice(),
  }))
  return newData;
}