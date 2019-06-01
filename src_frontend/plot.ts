
import * as echarts from "echarts";
import { ECharts } from "echarts";
import { el, RedomComponent, list } from "redom";
import { StoreInterface } from "./store"


interface DropdownItemUpdate {
  value: string
  onclick: () => void
}

class DropdownItem implements RedomComponent {
  el: HTMLElement

  constructor() {
    this.el = el("a.dropdown-item")
  }

  update(data: DropdownItemUpdate) {
    this.el.textContent = data.value
    this.el.onclick = (event: Event) => data.onclick()
  }

  setActive() {
    this.el.classList.add("is-active")
  }

  setInactive() {
    this.el.classList.remove("is-active")
  }
}


class Dropdown implements RedomComponent {
  el: HTMLElement
  elHeader: HTMLElement
  elDropdownContent: HTMLElement
  listDropdownContent: any
  isActive: boolean
  selectedIndex?: number

  constructor() {
    this.isActive = false
    this.el = el("div.dropdown",
      {
        onclick: (event: Event) => {
          if (this.isActive) {
            this.el.classList.remove("is-active")
            this.isActive = false
          } else {
            this.el.classList.add("is-active")
            this.isActive = true
          }
        }
      },
      el("div.dropdown-trigger",
        el("button.button", {"aria-haspopup": true, "aria-controls": "dropdown-menu"},
          this.elHeader = el("span"),
          el("span.icon.is-small",
            el("i.fas.fa-angle-down", {"aria-hidden": true})
          )
        )
      ),
      el("div.dropdown-menu",
        this.elDropdownContent = el("div.dropdown-content")
      )
    )

    this.listDropdownContent = list(this.elDropdownContent, DropdownItem)
  }

  update(data: string[]) {
    let listUpdate: DropdownItemUpdate[] = data.map((value, i) => ({
      value: value,
      onclick: () => {
        if (this.selectedIndex != undefined) {
          ((this.listDropdownContent as any).views[this.selectedIndex] as DropdownItem).setInactive()
        }
        ((this.listDropdownContent as any).views[i] as DropdownItem).setActive()
        this.selectedIndex = i
        this.elHeader.textContent = data[i]
      }
    }))
    this.listDropdownContent.update(listUpdate)
    this.selectedIndex = undefined
  }

}


export class Plot implements RedomComponent {
  el: HTMLElement
  elPlot: HTMLElement
  chart: ECharts
  dropdown: Dropdown

  constructor(public store: StoreInterface) {
    this.el = el("div",
      this.dropdown = new Dropdown(),
      this.elPlot = el("div", {style: "width: 600px;height:400px;"})
    )

    this.chart = echarts.init(this.elPlot as HTMLDivElement);

    this.fetchData();
    this.dropdown.update(["A", "B", "C"])
  }

  async fetchData() {
    let data = await this.store.fetchData({
      sortKind: 0
    })
    console.log(data)

    const numCols = data.length;
    const numRows = data[0].values.length;
    console.log(numRows, numCols);

    let rowsData = Array(numRows);
    for (let i=0; i<numRows; i++) {
      let rowData = Array(2);
      rowData[0] = data[1].values[i].toString();
      rowData[1] = data[2].values[i].toString();
      rowsData[i] = rowData;
    }
    console.log(rowsData);

    // specify chart configuration item and data
    let option = {
      xAxis: {},
      yAxis: {},
      series: [{
        symbolSize: 5,
        data:rowsData,
        type: 'scatter'
      }]
    };
    this.chart.setOption(option);
  }
}


