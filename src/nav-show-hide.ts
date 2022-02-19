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
