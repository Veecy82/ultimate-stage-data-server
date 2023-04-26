const elements = []
for (const j of [1, 2, 3, 4]) {
  elements.push(
    Array.from(document.querySelectorAll(`.index-effect-item-alt-${j}`))
  )
}
elements[0] = elements[0].concat(
  Array.from(document.querySelectorAll('.index-effect-item-alt-5'))
)

console.log(elements)

let i = 0
setInterval(() => {
  i = (i + 1) % 80
  change = i % 4
  for (const elm of elements[change]) {
    elm.classList.toggle('hide-with-opacity')
  }
}, 2000)
