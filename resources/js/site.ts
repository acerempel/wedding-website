const navlist = document.getElementById('home-nav')
type SectionInfo = { link: Element, order: number }
const sections = new Map<Element, SectionInfo>()
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
      visible_now.sort((a, b) => b.order > a.order ? 1 : (b.order < a.order ? -1 : 0))
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
  observer.observe(target)
}
