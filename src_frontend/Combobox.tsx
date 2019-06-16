import { createState, createEffect, onCleanup } from 'solid-js'

interface ComboboxProps {
  items: string[],
  selectedIndex?: number,
  cbSelect: (index: number) => void,
}

export function Combobox(props: ComboboxProps) {

  const [state, setState] = createState({
    active: false,
  })

  function onClick(event: Event) {
    setState({active: !state.active})
  }
  function onBlur(event: Event) {
    setState({active: false})
  }

  // Note the click handler of the dropdown items uses an onMouseDown
  // so that the onBlur of the menu expansion isn't handled before the
  // onClick of the item, see:
  // https://stackoverflow.com/questions/17769005/onclick-and-onblur-ordering-issue
  return (
    <div class={("dropdown" + (state.active ? " is-active" : "") )}>
      <div class="dropdown-trigger">
        <button class="button" onclick={onClick} onblur={onBlur}>
          <span style="font-size: 0.875rem;">{(props.selectedIndex != undefined ? props.items[props.selectedIndex] : "")}</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <$ when={state.active}>
        <div class="dropdown-menu">
          <div class="dropdown-content">
            {(props.items.map((item, index) =>
              <a class={("dropdown-item modified" + (props.selectedIndex === index ? " is-active" : ""))} onmousedown={(event) => {
                console.log("clicked li")
                //props.selected.set(item)
                //props.selected = item
                props.cbSelect(index)
              }}>
                {item}
              </a>)
            )}
          </div>
        </div>
      </$>
    </div>
  )
}
