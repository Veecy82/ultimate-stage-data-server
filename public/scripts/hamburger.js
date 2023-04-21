const navMenu = document.querySelector('.navmenu')
const hamburger = document.querySelector('.hamburger')

hamburger.addEventListener('click', (e) => {
  navMenu.classList.toggle('navmenu-open')
  hamburger.classList.toggle('hamburger-open')
})
