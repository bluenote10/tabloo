import { createStore } from "solid-js/store";
import { Show } from "solid-js/web";

import { IconAngleDown } from "./Icons";

interface DropdownProps {
  items: string[];
  selectedIndex?: number;
  cbSelect: (index: number) => void;
}

export function Dropdown(props: DropdownProps) {
  const [state, setState] = createStore({
    active: false,
  });

  function onClick(event: Event) {
    setState({ active: !state.active });
  }
  function onBlur(event: Event) {
    setState({ active: false });
  }

  // Note the click handler of the dropdown items uses an onMouseDown
  // so that the onBlur of the menu expansion isn't handled before the
  // onClick of the item, see:
  // https://stackoverflow.com/questions/17769005/onclick-and-onblur-ordering-issue
  return (
    <div class={"dropdown" + (state.active ? " is-active" : "")}>
      <div class="dropdown-trigger">
        <button class="button is-small" onclick={onClick} onblur={onBlur}>
          <span class="dropdown-text">
            {props.selectedIndex != undefined
              ? props.items[props.selectedIndex]
              : ""}
          </span>
          <span class="icon is-small">
            <IconAngleDown />
          </span>
        </button>
      </div>
      <Show when={state.active}>
        <div class="dropdown-menu customz">
          <div class="dropdown-content">
            {props.items.map((item, index) => (
              <a
                class={
                  "dropdown-item modified" +
                  (props.selectedIndex === index ? " is-active" : "")
                }
                onmousedown={(event) => {
                  props.cbSelect(index);
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </Show>
    </div>
  );
}
