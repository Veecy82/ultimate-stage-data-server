const elements = []
for (const j of [1, 2, 3, 4]) {
  elements.push(
    Array.from(document.querySelectorAll(`.index-effect-item-alt-${j}`))
  )
}
const container = document.querySelector('.index-effect-inner-container')

let i = 0
setInterval(() => {
  i = (i + 1) % 4
  for (const elm of elements[i]) {
    elm.classList.toggle('hide-with-opacity')
  }
}, 1000)
/*
function mouseTranslate(xPct) {
  container.style.transform = `translateX(${(100 / 56) * (2 * xPct - 1)}%)`
}

document.addEventListener('mousemove', (e) => {
  const xPct = e.pageX / window.innerWidth
  console.log(xPct)
  mouseTranslate(xPct)
})
*/
