import { el, mount, list, List, RedomComponent } from 'redom';
import axios from 'axios';
import * as fn from "./fn";


class Th implements RedomComponent {
  el: HTMLElement

  constructor () {
    this.el = el('th');
  }

  update(value: string) {
    this.el.textContent = value;
  }
}

class Td implements RedomComponent {
  el: HTMLElement

  constructor () {
    this.el = el('td');
  }

  update(value: string) {
    this.el.textContent = value;
  }
}

class Tr implements RedomComponent {
  el: HTMLElement
  tr: List

  constructor () {
    this.tr = list('tr', Td);
    this.el = this.tr.el;
  }

  update(values: string[]) {
    this.tr.update(values);
  }
}


export class TableWidget {
  el: HTMLElement
  thead: List
  tbody: List

  constructor() {
    this.el = el("table", [
      this.thead = list("thead", Th),
      this.tbody = list('tbody', Tr),
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
    let columnNames = data.map((x: any) => x.columnName)
    this.thead.update(columnNames)
    this.tbody.update(transposedData);
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