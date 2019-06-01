
import { el, text, mount, list, List, RedomComponent, RedomComponentConstructor, setChildren } from 'redom';
import axios from 'axios';
import * as fn from "./fn";
import { TableData, StoreInterface } from 'store';

interface ThUpdate {
  value: string
  sortKind: number
  onsort: () => void
}

class Th implements RedomComponent {
  el: HTMLElement
  node: Node
  sortButton: HTMLElement

  constructor () {
    this.el = el('th',
      this.node = text(""),
      this.sortButton = el("a"),
    );
  }

  update(data: ThUpdate) {
    this.node.nodeValue = data.value;
    this.sortButton.onclick = (event: Event) => {
      data.onsort();
    }

    // update sort symbol
    if (data.sortKind == 0) {
      setChildren(this.sortButton, [
        el("i.fas.fa-long-arrow-alt-up"),
        el("i.fas.fa-long-arrow-alt-down"),
      ]);
    } else if (data.sortKind < 0) {
      setChildren(this.sortButton, [el("i.fas.fa-sort-amount-down")]);
    } else if (data.sortKind > 0) {
      setChildren(this.sortButton, [el("i.fas.fa-sort-amount-up")]);
    }

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


interface TableWidgetProps {
  onsort: (column: string) => void
}

export class TableWidget implements RedomComponent {
  el: HTMLElement
  thead: List
  tbody: List

  constructor(public props: TableWidgetProps) {
    this.el = el("table.table.is-striped.is-narrow.is-hoverable.compact-table", [
      this.thead = list("thead", Th),
      this.tbody = list('tbody', Tr),
    ])
  }

  update(data: TableData[]) {

    const numCols = data.length;
    const numRows = data[0].values.length;
    console.log(numRows, numCols);

    // we need to convert from columnar to row-wise data
    let rowsData = Array(numRows);
    for (let i=0; i<numRows; i++) {
      let rowData = Array(numCols);
      for (let j=0; j<numCols; j++) {
        rowData[j] = data[j].values[i].toString();
      }
      rowsData[i] = rowData;
    }
    console.log(rowsData);

    let headerData: ThUpdate[] = data.map((x: TableData) => ({
      value: x.columnName,
      sortKind: x.sortKind,
      onsort: () => { this.props.onsort(x.columnName) }
    }))

    this.thead.update(headerData)
    this.tbody.update(rowsData);
  }

}
