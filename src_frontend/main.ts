import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'


import { el, text, mount, list, List, RedomComponent } from 'redom';
import axios from 'axios';
import * as fn from "./fn";

import { TableWidget } from "./table";


class App implements RedomComponent {
  el: HTMLElement
  table: TableWidget

  constructor() {
    this.table = new TableWidget();
    this.el = el("div", this.table)
    /*
    this.el = el(
      this.table
    );
    */
    /*
    this.el = el(
      //this.table = new TableWidget()
      //this.table
      this.table = el(TableWidget as any) as any as TableWidget
    );
    */
    console.log("starting fetch");
    this.fetchData();
  }

  async fetchData() {
    let response = await axios.get("http://localhost:5000/api/get_data", {
      params: {
        ID: 12345
      }
    })
    console.log("Received response...");
    let tableData = response.data;
    console.log(tableData)
    let transformedData = fn.mapEntries(tableData, (k, v) => ({
      columnName: k,
      values: v,
    }))
    console.log(transformedData)
    this.table.update(transformedData)
  }

  update(data: any) {
  }

}

const main = new App();
mount(document.body, main);

/*
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
*/