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

        <a class="ui-navbar-logo" href="https://github.com/bluenote10/tabloo">
          tabloo
        </a>

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

      </nav>
      {( props.contents[state.activeIndex].component )}
    </>
  )
}
