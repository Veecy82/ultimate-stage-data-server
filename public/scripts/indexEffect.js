const elements = []
for (const j of [1, 2, 3, 4]) {
  elements.push(document.querySelectorAll(`.index-effect-item-${j}`))
}

console.log(elements)

let i = 0
setInterval(() => {
  i = (i + 1) % 32
  change = (i % 4) + 1
}, 1000)
