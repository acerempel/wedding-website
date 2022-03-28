import {createSignal} from "solid-js"
import { isServer } from "solid-js/web"
import {TOC} from './sections'
import theme from 'tailwindcss/defaultTheme.js'

const small = (theme.screens as { [key: string]: string })?.sm

function fakeMatcher() {
  return {
    matches: true,
    addEventListener(event: 'change', func: (ev: MediaQueryListEvent) => void) {}
  }
}

export default () => {
  const smallness = isServer ? fakeMatcher() : window.matchMedia(`(min-width: ${small})`)
  const [isNotSmall, setNotSmall] = createSignal(smallness.matches)
  smallness.addEventListener('change', (event) => setNotSmall(event.matches))
  const [opened, setOpened] = createSignal(false)
  return (
    <nav class="grid-left justify-self-end sm:justify-self-stretch sticky top-4 sm:top-0 sm:relative">
      <button
        type="button"
        class="block sm:hidden button drop-shadow-md"
        onclick={() => setOpened(true)}
      >Contents</button>
      <div
        class={`
          absolute sm:sticky top-0 sm:top-6 right-0 text-right items-end
          sm:flex flex-col drop-shadow-lg sm:drop-shadow-none bg-teal-100
          aubergine sm:not-courgette sm:bg-transparent ${ isNotSmall() || opened() ? '' : 'hidden' }
        `}
        id="home-nav"
        aria-expanded="false">
        <button
          type="button" aria-controls="home-nav"
          class="block sm:hidden button mb-4 ml-auto"
          onclick={() => setOpened(false)}
        >Close</button>
        <TOC />
      </div>
    </nav>
  )
}

