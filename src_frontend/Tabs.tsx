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
      <nav class="navbar is-fixed-top is-dark nav-customized is-spaced" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="https://bulma.io">
            Tabloo
          </a>

          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item">
              Home
            </a>

            <a class="navbar-item">
              Documentation
            </a>

            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                More
              </a>

              <div class="navbar-dropdown">
                <a class="navbar-item">
                  About
                </a>
                <a class="navbar-item">
                  Jobs
                </a>
                <a class="navbar-item">
                  Contact
                </a>
                <hr class="navbar-divider"/>
                <a class="navbar-item">
                  Report an issue
                </a>
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a class="button is-light">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div class="tabs is-small">
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
