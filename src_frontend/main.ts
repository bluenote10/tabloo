import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'


import { el, text, mount, list, List, RedomComponent, setChildren } from 'redom';
import axios from 'axios';
import * as fn from "./fn";

import { TableWidget } from "./table";
import { Tabs } from "./tabs";

import { StoreInterface, StoreBackend, DataFetchOptions } from "./store";


interface State {
  sortColumn?: string
  sortKind: number
}

class TableHandler implements RedomComponent {
  el: HTMLElement
  table: TableWidget

  state: State
  dataFetchOptions: DataFetchOptions

  constructor(public store: StoreInterface) {
    this.dataFetchOptions = {
      sortKind: 0
    }
    this.state = {
      sortKind: 0
    }

    let tableProps = {
      onsort: (column: string) => {
        console.log(column);
        if (this.state.sortColumn === column) {
          if (this.state.sortKind > 0) {
            this.state.sortKind = -1;
          } else {
            this.state.sortColumn = undefined;
            this.state.sortKind = 0;
          }
        } else {
          this.state.sortKind = +1;
          this.state.sortColumn = column;
        }
        this.dataFetchOptions.sortColumn = this.state.sortColumn;
        this.dataFetchOptions.sortKind = this.state.sortKind
        this.fetchData();
      }
    }
    this.table = new TableWidget(tableProps);
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
    let transformedData = await this.store.fetchData(this.dataFetchOptions)
    console.log(transformedData)
    this.table.update(transformedData)
  }

  update(data: any) {
  }

}

// const main = new TableHandler(new StoreBackend());
//const main = el(Tabs as any, new TableHandler(new StoreBackend()), new TableHandler(new StoreBackend()));
const main = new Tabs([
  {
    name: "Table",
    component: new TableHandler(new StoreBackend()),
  },
  {
    name: "Plot",
    component: new TableHandler(new StoreBackend()),
  },
])
mount(document.body, main);
