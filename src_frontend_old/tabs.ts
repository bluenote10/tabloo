import { el, RedomComponent, setChildren } from 'redom';


type TabContent = Array<{
  name: string
  component: RedomComponent
}>


class TabHeaderLi implements RedomComponent {
  el: HTMLElement
  constructor(name: string, onclick: () => void) {
    this.el = el("li",
      el("a",
        el("span", name)
      )
    )
  }
  update(isActive: boolean) {
    if (isActive) {
      this.el.classList.add("is-active")
    } else {
      this.el.classList.remove("is-active")
    }
  }
}


export class Tabs implements RedomComponent {
  el: HTMLElement
  container: HTMLElement
  content: TabContent
  headerChildren: HTMLElement[]

  constructor(content: TabContent) {
    this.content = content
    this.headerChildren = new Array(content.length)
    this.el = el("div",
      el("div.tabs.is-boxed.is-small",
        el("ul",
          content.map((tab, i) =>
            this.headerChildren[i] = el("li",
              el("a",
                {onclick: (event: Event) => this.setActive(i)},
                el("span", tab.name)
              )
            )
          )
        )
      ),
      this.container = el("div"),
    )
    /*
    this.el = el("div",
      this.header = list("ul", TabHeaderLi, null)
      this.container = el("div"),
    )
    */
    this.setActive(0)
  }

  setActive(i: number) {
    this.headerChildren.map(li => li.classList.remove("is-active"))
    this.headerChildren[i].classList.add("is-active")
    setChildren(this.container, [this.content[i].component])
  }
}
