const navlist = document.getElementById('home-nav')
type SectionInfo = {
    /** The <a> element. */
    link: Element,
    /** The section's ordering in the DOM relative to the other sections. */
    order: number,
    /** This section's heading. */
    heading?: Element,
}
const sections = new Map<Element, SectionInfo>()
/** Keep track of which sections are visible. */
const visible = new Set<SectionInfo>()
const headingsVisible = new Map<Element, Boolean>()
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
    const visible_with_headings = visible_now.filter((sec) => sec.heading && headingsVisible.get(sec.heading))
    visible_now = visible_with_headings.isEmpty() ? visible_now : visible_with_headings
    // Sort by DOM order, earliest first
    visible_now.sort((a, b) => b.order > a.order ? -1 : (b.order < a.order ? 1 : 0))
    // console.log("Visible:", visible_now.map(sec => (sec.link as HTMLAnchorElement).href))
    current && markNotCurrent(current.link)
    // The visible section that is first in DOM order is the current section
    current = visible_now[0]
    current && markCurrent(current.link)
}

const headingObserver = new IntersectionObserver(
    function(entries) {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                headingsVisible.set(entry.target, true)
            } else {
                headingsVisible.set(entry.target, false)
            }
        }
        computeCurrentSection()
    }
)

const sectionObserver = new IntersectionObserver(
    function(entries) {
      // Update the set of visible sections
      for (const entry of entries) {
        if (entry.isIntersecting) {
            visible.add(sections.get(entry.target)!)
        } else {
            visible.delete(sections.get(entry.target)!)
        }
      }
      computeCurrentSection()
    },
    {
        rootMargin: "0px 24px 0px 0px"
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
  const headingId = target.getAttribute('aria-labelledby')
  const heading = (headingId && document.getElementById(headingId)) || undefined
  const info = { order: index, link, heading }
  sections.set(target, info)
  index += 1
  sectionObserver.observe(target)
  heading && headingObserver.observe(heading)
}

const navShow = document.getElementById('nav-show')!
const navHide = document.getElementById('nav-hide')!
const navList = document.getElementById('home-nav')!
navShow.addEventListener('click', (event) => {
    navList.classList.remove('hidden')
    navList.setAttribute('aria-expanded', 'true')
})
navHide.addEventListener('click', (event) => {
    navList.classList.add('hidden')
    navList.setAttribute('aria-expanded', 'false')
})
