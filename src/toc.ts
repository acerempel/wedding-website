const navlist = document.getElementById('home-nav')

type SectionInfo = {
    /** The <a> element. */
    link: Element,
    /** The section's ordering in the DOM relative to the other sections. */
    order: number,
}

/** Mapping from heading elements to SectionInfo for section headed by the heading */
const sections = new Map<Element, SectionInfo>()
/** Mapping from <a> elements in the toc to SectionInfo for section that the <a> links to */
const links = new Map<Element, SectionInfo>()

/** How much of an element is visible? */
const enum Visibility {
  /** Partially visible, neither wholly visible nor invisible. */
  Part,
  /** Entirely visible. */
  Whole,
}

function lessVisibleThan(v1: Visibility | null, v2: Visibility): boolean {
  if (v1 === null) {
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
let manually_selected: Visibility | null = null

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
    current = visible_now[0][0]
    current && markCurrent(current.link)
}

const sectionObserver = new IntersectionObserver(
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

// For keeping track of the sections' order, since querySelectorAll returns
// things in DOM order.
let index = 0
for (const link of navlist!.querySelectorAll('a[href]')) {
  const url = new URL((link as HTMLAnchorElement).href)
  // Get the part after the hash symbol
  const slug = url.hash.slice(1)
  const target = document.getElementById(slug)
  if (!target) {
      console.error(`${slug} is not the id of anything `)
      continue
  }
  link.addEventListener('click', () => {
    current && markNotCurrent(current.link)
    current = links.get(link) || null
    manually_selected = Visibility.Whole
    markCurrent(link)
  })
  const info = { order: index, link, updated: 0 }
  sections.set(target, info)
  links.set(link, info)
  index += 1
  sectionObserver.observe(target)
}
