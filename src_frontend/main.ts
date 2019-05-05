import { el, mount, list, List } from 'redom';
import axios from 'axios';
import * as fn from "./fn";

console.log(el);

class Td {
  el: HTMLElement;

  constructor () {
    this.el = el('td');
  }

  update(value: string) {
    this.el.textContent = value;
  }
}

class Tr {
  el: HTMLElement;
  list: List;

  constructor () {
    this.list = list('tr', Td);
    this.el = this.list.el;
  }

  update(values: string[]) {
    this.list.update(values);
  }
}


export class TableWidget {
  el: HTMLElement;
  table: List;

  constructor() {
    this.table = list('table', Tr);
    this.el = el("div", [
      "Hello World",
      this.table,
    ])
  }

  update(data: any) {
    console.log(data);
    const numCols = data.length;
    const numRows = data[0].values.length;
    console.log(numRows, numCols);
    let transposedData = Array(numRows);
    for (let i=0; i<numRows; i++) {
      let rowData = Array(numCols);
      for (let j=0; j<numCols; j++) {
        rowData[j] = data[j].values[i].toString();
      }
      transposedData[i] = rowData;
    }
    this.table.update(transposedData);
  }

}

const table = new TableWidget();
mount(document.body, table);

table.update([
  {
    columnName: "A",
    values: [1, 2, 3],
  },
  {
    columnName: "B",
    values: [2, 4, 6],
  },
])

window.setTimeout(function () {
  table.update([
    {
      columnName: "A",
      values: [1, 2, 3, 4],
    },
    {
      columnName: "B",
      values: [2, 4, 6, 8],
    },
    {
      columnName: "C",
      values: ["A", "B", "C", "D"],
    },
  ])

  let req = axios.get("http://localhost:5000/api/get_data", {
    params: {
      ID: 12345
    }
  }).then((response: any) => {
    console.log("Received response...");
    let tableData = response.data;
    console.log(tableData)
    let transformedData = fn.mapEntries(tableData, (k, v) => ({
      columnName: k,
      values: v,
    }))
    console.log(transformedData)
    table.update(transformedData)
  }).catch((error: any) => {
    console.log(error);
  })

}, 1000);