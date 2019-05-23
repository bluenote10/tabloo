
import { el, text, mount, list, List, RedomComponent } from 'redom';
import axios from 'axios';
import * as fn from "./fn";


class Th implements RedomComponent {
  el: HTMLElement
  node: Node

  constructor () {
    let span: HTMLElement
    this.el = el('th',
      this.node = text(""),
      span = el("a", {onclick: (event: Event) => {console.log("clicked")}},
        el("i.fas.fa-sort-amount-down", ),
      ),
    );
    //span.onclick =  (event: Event) => {console.log("clicked")};
  }

  update(value: string) {
    this.node.nodeValue = value;
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


export class TableWidget implements RedomComponent {
  el: HTMLElement
  thead: List
  tbody: List

  constructor() {
    this.el = el("table.table.is-striped.is-narrow.is-hoverable.compact-table", [
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
