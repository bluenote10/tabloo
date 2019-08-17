import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

/*
type TabHeader = {
  icon: string,
  text: string,
}

type TabContents = Array<{
  name: JSX.Element,
  component: JSX.Element,
}>

interface TabsProps {
  contents: TabContents
}
*/

export function Tabs(props: {
    activeIndex: number,
    contents: JSX.Element[],
    onActivate: (i: number) => void
  }) {

  return (
    <nav class="ui-navbar">

      <div class="ui-sidebar-placeholder">
        <a class="ui-navbar-logo" href="https://github.com/bluenote10/tabloo">
          tabloo
        </a>
      </div>

      <div class="container">
        { props.contents.map((content, index) =>
          <a
            class={("ui-navbar-button " + (index === props.activeIndex ? "is-active" : ""))}
            onclick={(event) => props.onActivate(index)}
          >
            {content}
          </a>
        )}
      </div>

      <div class="ui-sidebar-placeholder"/>

    </nav>

  )
}
