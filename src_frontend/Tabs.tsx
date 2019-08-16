import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

type TabContents = Array<{
  name: JSX.Element,
  component: JSX.Element,
}>

interface TabsProps {
  contents: TabContents
}

export function Tabs(props: TabsProps) {
  console.log(props)

  const [state, setState] = createState({
    activeIndex: 0
  })

  createEffect(() => {
    console.log("Activated tab:", state.activeIndex)
  })

  return (
    <>
      <nav class="ui-navbar">

        <div class="ui-sidebar-placeholder">
          <a class="ui-navbar-logo" href="https://github.com/bluenote10/tabloo">
            tabloo
          </a>
        </div>

        <div class="container">
          { props.contents.map((content, index) =>
            <a
              class={("ui-navbar-button " + (index === state.activeIndex ? "is-active" : ""))}
              onclick={(event) => setState({activeIndex: index})}
            >
              {content.name}
            </a>
          )}
        </div>

        <div class="ui-sidebar-placeholder"/>

      </nav>

      <div class="ui-padded-container">
        <div class="container">
          {( props.contents[state.activeIndex].component )}
        </div>
      </div>
    </>
  )
}
