import { JSX } from "solid-js";

export function Tabs(props: {
  activeIndex: number;
  tabHeaders: JSX.Element[];
  onActivate: (i: number) => void;
}) {
  return (
    <nav class="ui-navbar">
      <div class="ui-sidebar-placeholder">
        <a class="ui-navbar-logo" href="https://github.com/bluenote10/tabloo">
          tabloo
        </a>
      </div>

      <div class="container">
        {props.tabHeaders.map((tabHeader, index) => (
          <a
            class={
              "ui-navbar-button " +
              (index === props.activeIndex ? "is-active" : "")
            }
            onclick={(event) => props.onActivate(index)}
          >
            {tabHeader}
          </a>
        ))}
      </div>

      <div class="ui-sidebar-placeholder" />
    </nav>
  );
}
