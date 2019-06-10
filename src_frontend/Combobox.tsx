import { createState, createEffect, onCleanup } from 'solid-js'

interface ComboboxProps {
  items: string[],
  selectedIndex?: number,
  cbSelect: (index: number) => void,
}

export function Combobox(props: ComboboxProps) {

  return (
    <div>
      <div>Selected index: {(props.selectedIndex != undefined ? props.selectedIndex : "")}</div>
      {/*<div>Selected: {(props.selectedIndex != undefined ? props.items[props.selectedIndex] : "")}</div>*/}
      {/*<div>Selected: {(props.selectedIndex != undefined && props.items[props.selectedIndex])}</div>*/}
      <ul>
        {(props.items.map((item, index) =>
          <li>
            <a onclick={(event) => {
              console.log("clicked li")
              //props.selected.set(item)
              //props.selected = item
              props.cbSelect(index)
            }}>
              {item} {(props.selectedIndex === index) ? "[selected]" : ""}
            </a>
          </li>)
        )}
      </ul>
    </div>
  )
}
