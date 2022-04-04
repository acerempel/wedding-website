import {createEffect, For, JSX, onMount} from "solid-js"
import {createStore, DeepReadonly} from "solid-js/store"
import {isServer} from"solid-js/web"
import slug from "slug"

type SectionInfo = {
    /** The <a> element. */
    link: Element,
    /** The section's ordering in the DOM relative to the other sections. */
    order: number,
}

/** Mapping from <section> elements to SectionInfo for that section */
const sections = new Map<Element, SectionInfo>()
/** Mapping from <a> elements in the toc to SectionInfo for section that the <a> links to */
const sections_by_link = new Map<Element, SectionInfo>()

/** How much of an element is visible? */
const enum Visibility {
  /** Partially visible, neither wholly visible nor invisible. */
  Part,
  /** Entirely visible. */
  Whole,
}

function lessVisibleThan(v1: Visibility | null, v2: Visibility | null): boolean {
  if (v1 === null && v2 !== null) {
    return true
  } else if (v1 === Visibility.Part && v2 === Visibility.Whole) {
    return true
  } else {
    return false
  }
}

/** Keep track of which sections are visible. */
const visible = new Map<SectionInfo, Visibility>()

let current: SectionInfo | null = null
let manually_selected: Visibility | true | null = null

function markCurrent(link: Element) {
    link.setAttribute('aria-current', 'true')
}
function markNotCurrent(link: Element) {
    link.setAttribute('aria-current', 'false')
}

function computeCurrentSection() {
    if (manually_selected) {
      // The current section was already set by someone clicking on the link. We
      // only change the current section if the manually selected one is less
      // visible than it was when it was selected. (Actually manually_selected
      // is never assigned `Visibility.Part` – it should be, in case there are
      // ever sections taller than the viewport.)
      let current_visibility = current && (visible.get(current) || null)
      if (manually_selected === true) { manually_selected = current_visibility }
      if (lessVisibleThan(current_visibility, manually_selected)) {
        manually_selected = null
      } else {
        return
      }
    }
    // Copy them into an array so we can sort them
    let visible_now = [...visible]
    const visible_entirely = visible_now.filter(([_section, visibility]) => visibility === Visibility.Whole)
    // If any sections are visible in their entirety, the current section is
    // among those; otherwise it can be any of the partially visible sections.
    visible_now = visible_entirely.length === 0 ? visible_now : visible_entirely
    // Sort by DOM order, earliest first
    visible_now.sort(([a, _v1], [b, _v2]) => b.order > a.order ? -1 : (b.order < a.order ? 1 : 0))
    // console.log("Visible:", visible_now.map(sec => (sec.link as HTMLAnchorElement).href))
    current && markNotCurrent(current.link)
    // The visible section that is first in DOM order is the current section
    current = visible_now[0] && visible_now[0][0]
    current && markCurrent(current.link)
}

function makeObserver() {
  return new IntersectionObserver(
    function(entries) {
      // Update the set of visible sections
      for (const entry of entries) {
        const section = sections.get(entry.target)!
        if (entry.intersectionRatio === 1) {
            visible.set(section, Visibility.Whole)
        } else if (entry.isIntersecting) {
            visible.set(section, Visibility.Part)
        } else {
            visible.delete(section)
        }
      }
      computeCurrentSection()
    },
    {
        rootMargin: "0px 24px 0px 0px",
        // Notify us when an element changes from invisible to visible and when
        // it changes from wholly to partially visible, or vice versa.
        threshold: [0, 1],
    }
  )
}

const sectionObserver = isServer ? undefined : makeObserver()

interface Section {
  readonly slug: string
  readonly heading: string
  readonly element: DeepReadonly<HTMLElement>
}

const [state, updateState] = createStore<{ sections: Section[] }>({ sections: [] })

export function Section(props: {heading: string, children: JSX.Element | JSX.Element[], invisibleHeading?: boolean}) {
  // Can't observe it right away because this function is called (by way of
  // the `ref` attribute) before the element is added to the DOM.
  let element = undefined as unknown as HTMLElement;
  const its_slug = slug(props.heading)

  onMount(() => {
    sectionObserver?.observe(element)
    const section: Section = {
      heading: props.heading,
      slug: its_slug,
      element: element as unknown as DeepReadonly<HTMLElement>,
    }
    updateState('sections', sections => [...sections, section])
  })

  return (
    <section ref={element} id={its_slug} class="pt-8 first:pt-0">
      <h2
        class={"mb-2 text-2xl font-medium" + (props.invisibleHeading ? ' sr-only' : '')}
      >{props.heading}</h2>
      {props.children}
    </section>
  )
}

export function TOC() {
  function registerLink(link: HTMLAnchorElement, section: Section, index: number) {
    const info = { order: index, link, updated: 0 }
    sections.set(section.element as unknown as Element, info)
    sections_by_link.set(link, info)
  }

  const linkClicked: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (event) => {
    const link = event.currentTarget
    current && markNotCurrent(current.link)
    current = sections_by_link.get(link) || null
    manually_selected = true
    markCurrent(link)
  }

  return (
    <ul class="space-y-4 mx-6 mb-4 mt-2 sm:m-0">
        {state.sections.map((section, index) => (
          <li>
            <a
            ref={link => registerLink(link, section, index)}
            href={`#${section.slug}`}
            onclick={linkClicked}
            rel="external"
            >{section.heading}</a>
          </li>
        ))}
    </ul>
  )
}
