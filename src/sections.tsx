import {createSelector, createSignal, JSX, onMount} from "solid-js"
import {isServer} from"solid-js/web"
import slug from "slug"

type SectionInfo = {
    /** The slug. */
    link: string,
    /** The section's ordering in the DOM relative to the other sections. */
    order: number,
    onVisible?: (el: Element) => void,
}

/** Mapping from <section> elements to SectionInfo for that section */
const sections = new Map<string, SectionInfo>()

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

const [currentLink, setCurrentLink] = createSignal<string>()

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
    // The visible section that is first in DOM order is the current section
    current = visible_now[0] && visible_now[0][0]
    setCurrentLink(current.link)
}

function makeObserver() {
  return new IntersectionObserver(
    function(entries) {
      // Update the set of visible sections
      for (const entry of entries) {
        const section = sections.get(entry.target.id)!
        if (entry.intersectionRatio === 1) {
            visible.set(section, Visibility.Whole)
        } else if (entry.isIntersecting) {
            visible.set(section, Visibility.Part)
            section.onVisible && section.onVisible(entry.target)
        } else {
            visible.delete(section)
        }
      }
      computeCurrentSection()
    },
    {
        // Notify us when an element changes from invisible to visible and when
        // it changes from wholly to partially visible, or vice versa.
        threshold: [0, 1],
    }
  )
}

const sectionObserver = isServer ? undefined : makeObserver()

const sections_list: Section[] = []

interface Section {
  readonly slug: string
  readonly heading: string
  readonly element: () => HTMLElement
}

let next_ix = 0

export function Section(props: {
    heading: string, children: JSX.Element | JSX.Element[],
    invisibleHeading?: boolean,
    onVisible?: (el: Element) => void,
}) {
  // Can't observe it right away because this function is called (by way of
  // the `ref` attribute) before the element is added to the DOM.
  const its_slug = slug(props.heading)
    const { invisibleHeading, heading } = props
    const element = () => <section id={its_slug} ref={(el) => sectionObserver?.observe(el)} class="pt-8 first:pt-0">
        <h2
        class={"mb-2 text-2xl font-medium" + (invisibleHeading ? ' sr-only' : '')}
        >{heading}</h2>
        {props.children}
    </section> as HTMLElement

    const section: Section = {
      heading: props.heading,
      slug: its_slug,
      element,
    }
    if (! sections.get(its_slug)) sections_list.push(section)

    sections.set(its_slug, {
        order: next_ix,
        link: its_slug,
        onVisible: props.onVisible,
  })
  next_ix = next_ix + 1
}

export function Sections() {
    return sections_list.map((sec) => sec.element)
}

export const TOC = () => {
  const linkClicked: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (event) => {
    const link = event.currentTarget
    const slug = new URL(link.href).hash.slice(1)
    manually_selected = true
    setCurrentLink(slug)
  }

    const isCurrent = createSelector(currentLink)

  return (
    <ul class="space-y-4 mx-6 mb-4 mt-2 sm:m-0">
        {/*@once*/ sections_list.map((section) => (
          <li>
            <a
                aria-current={isCurrent(section.slug)}
                href={`#${section.slug}`}
                onclick={linkClicked}
                rel="external"
            >{section.heading}</a>
          </li>
        ))}
    </ul>
  )
}
