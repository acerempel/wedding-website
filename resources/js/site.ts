const navlist = document.getElementById('home-nav')

type SectionInfo = {
    /** The <a> element. */
    link: Element,
    /** The section's ordering in the DOM relative to the other sections. */
    order: number,
}

const sections = new Map<Element, SectionInfo>()

/** How much of an element is visible? */
const enum Visibility {
  /** Partially visible, neither wholly visible nor invisible. */
  Part,
  /** Entirely visible. */
  Whole,
}

/** Keep track of which sections are visible. */
const visible = new Map<SectionInfo, Visibility>()

let current: SectionInfo | null = null

function markCurrent(link: Element) {
    link.setAttribute('aria-current', 'true')
}
function markNotCurrent(link: Element) {
    link.setAttribute('aria-current', 'false')
}

function computeCurrentSection() {
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
  const info = { order: index, link, updated: 0 }
  sections.set(target, info)
  index += 1
  sectionObserver.observe(target)
}

const navShow = document.getElementById('nav-show')!
const navHide = document.getElementById('nav-hide')!
const navList = document.getElementById('home-nav')!
navShow.addEventListener('click', (_event) => {
    navList.classList.remove('hidden')
    navList.setAttribute('aria-expanded', 'true')
})
navHide.addEventListener('click', (_event) => {
    navList.classList.add('hidden')
    navList.setAttribute('aria-expanded', 'false')
})
