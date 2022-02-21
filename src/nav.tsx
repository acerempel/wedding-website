import {createSignal} from "solid-js"
import {TOC} from './sections'

export default () => {
  const [hidden, setHidden] = createSignal(true)
  return (
    <nav class="grid-left justify-self-end sm:justify-self-stretch sticky top-4 sm:top-0 sm:relative">
      <button
        type="button"
        class="block sm:hidden button drop-shadow-md"
        onclick={() => setHidden(false)}
      >Contents</button>
      <div
        class={`
          absolute sm:sticky top-0 sm:top-6 right-0 text-right items-end
          sm:flex flex-col drop-shadow-lg sm:drop-shadow-none bg-teal-100
          aubergine sm:not-courgette sm:bg-transparent ${ hidden() ? 'hidden' : '' }
        `}
        id="home-nav"
        aria-expanded="false">
        <button
          type="button" aria-controls="home-nav"
          class="block sm:hidden button mb-4 ml-auto"
          onclick={() => setHidden(true)}
        >Close</button>
        <TOC />
      </div>
    </nav>
  )
}

