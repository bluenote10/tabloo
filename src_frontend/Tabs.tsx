import { createRoot, createState, createEffect, onCleanup } from 'solid-js';

type TabContents = Array<{
  name: string
  component: JSX.Element
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
      <div class="tabs is-boxed is-small">
        <ul>
          { props.contents.map((content, index) =>
            <li class={(index === state.activeIndex ? "is-active" : undefined)}>
              <a onclick={(event) => setState({activeIndex: index})}>
                {content.name}
              </a>
            </li>
          )}
        </ul>
      </div>
      {( props.contents[state.activeIndex].component )}
    </>
  )
}
