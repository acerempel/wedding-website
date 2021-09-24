const navlist = document.getElementById('home-nav')
type SectionInfo = {
    /** The <a> element. */
    link: Element,
    /** The section's ordering in the DOM relative to the other sections. */
    order: number,
}
const sections = new Map<Element, SectionInfo>()
/** Keep track of which sections are visible. */
const visible = new Set<SectionInfo>()
let current: SectionInfo | null = null

function markCurrent(link: Element) {
    link.setAttribute('aria-current', 'true')
}
function markNotCurrent(link: Element) {
    link.setAttribute('aria-current', 'false')
}

const observer = new IntersectionObserver(
    function(entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
            visible.add(sections.get(entry.target)!)
        } else {
            visible.delete(sections.get(entry.target)!)
        }
      }
      const visible_now = [...visible]
      visible_now.sort((a, b) => b.order > a.order ? -1 : (b.order < a.order ? 1 : 0))
      // console.log("Visible:", visible_now.map(sec => (sec.link as HTMLAnchorElement).href))
      current && markNotCurrent(current.link)
      current = visible_now[0]
      current && markCurrent(current.link)
    },
    {
        rootMargin: "0px 24px 0px 0px"
    }
)

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
  const info = {
      order: index,
      link,
  }
  sections.set(target, info)
  index += 1
  observer.observe(target)
}
