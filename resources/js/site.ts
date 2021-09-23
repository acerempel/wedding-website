const navlist = document.getElementById('home-nav')
const headings = new Map()
let currently_visible: Element | null = null

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
            currently_visible && markNotCurrent(currently_visible)
            currently_visible = headings.get(entry.target)
            currently_visible && markCurrent(currently_visible)
        } else {
            const disappeared = headings.get(entry.target)
            disappeared && markNotCurrent(disappeared)
        }
      }
    },
    {
        rootMargin: "0px 24px 0px 0px"
    }
)

for (const link of navlist!.querySelectorAll('a[href]')) {
  const url = new URL((link as HTMLAnchorElement).href)
  const slug = url.hash.slice(1)
  const target = document.getElementById(slug)
  if (!target) {
      console.error(`${slug} is not the id of anything `)
      continue
  }
  headings.set(target, link)
  observer.observe(target)
}
