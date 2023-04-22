import namesToInternal from './namesToInternal.js'

const n = Object.keys(namesToInternal)
n.sort()
const name1InputArea = document.querySelector('.name1InputArea')
const name1Input = document.querySelector('.name1Input')
const name1Suggestions = document.querySelector('.name1Suggestions')

const name2InputArea = document.querySelector('.name2InputArea')
const name2Input = document.querySelector('.name2Input')
const name2Suggestions = document.querySelector('.name2Suggestions')

const submitButton = document.querySelector('.smashButtonLink')

document.body.style.overflow = 'overlay'

name1InputArea.addEventListener('click', (e) => {
  name1Input.setCustomValidity('')
  e.stopPropagation()
})

name2InputArea.addEventListener('click', (e) => {
  name2Input.setCustomValidity('')
  e.stopPropagation()
})

document.body.addEventListener('click', () => {
  name1Suggestions.classList.add('hidden')
})

document.body.addEventListener('click', () => {
  name2Suggestions.classList.add('hidden')
})

name1Input.addEventListener('input', () => {
  name1Suggestions.classList.remove('hidden')
  name1Input.setCustomValidity('')
  name1Suggestions.replaceChildren()

  for (const name of n) {
    if (name.toLowerCase().includes(name1Input.value.toLowerCase())) {
      const el = document.createElement('li')
      el.classList.add(
        ...'p-2 font-bold uppercase bg-zinc-100 hover:bg-zinc-200 cursor-pointer flex-1 gap-2'.split(
          ' '
        )
      )
      el.classList.add('flex', 'items-center')
      const im = document.createElement('div')
      im.style.background = `url('images/icons/${namesToInternal[name]}.png')`
      im.style.backgroundSize = 'contain'
      im.style.width = '1.5rem'
      im.style.height = '1.5rem'
      const te = document.createElement('div')
      el.addEventListener('click', () => {
        name1Input.value = name
        name1Suggestions.classList.add('hidden')
      })

      te.innerText = name
      el.appendChild(im)
      el.appendChild(te)
      name1Suggestions.appendChild(el)
    }
  }
})

name2Input.addEventListener('input', () => {
  name2Suggestions.classList.remove('hidden')
  name2Input.setCustomValidity('')
  name2Suggestions.replaceChildren()

  for (const name of n) {
    if (name.toLowerCase().includes(name2Input.value.toLowerCase())) {
      const el = document.createElement('li')
      el.classList.add(
        ...'p-2 font-bold uppercase bg-zinc-100 hover:bg-zinc-200 cursor-pointer flex-1 gap-2'.split(
          ' '
        )
      )
      el.classList.add('flex', 'items-center')
      const im = document.createElement('div')
      im.style.background = `url('images/icons/${namesToInternal[name]}.png')`
      im.style.backgroundSize = 'contain'
      im.style.width = '1.5rem'
      im.style.height = '1.5rem'
      const te = document.createElement('div')
      el.addEventListener('click', () => {
        name2Input.value = name
        name2Suggestions.classList.add('hidden')
      })

      te.innerText = name
      el.appendChild(im)
      el.appendChild(te)
      name2Suggestions.appendChild(el)
    }
  }
})

name1Input.addEventListener('focus', () => {
  name1Suggestions.replaceChildren()

  for (const name of n) {
    if (name.toLowerCase().includes(name1Input.value.toLowerCase())) {
      const el = document.createElement('li')
      el.tabIndex = 0
      el.classList.add(
        ...'p-2 font-bold uppercase bg-zinc-100 hover:bg-zinc-200 cursor-pointer flex-1 gap-2'.split(
          ' '
        )
      )
      el.classList.add('flex', 'items-center')
      const im = document.createElement('div')
      im.style.background = `url('images/icons/${namesToInternal[name]}.png')`
      im.style.backgroundSize = 'contain'
      im.style.width = '1.5rem'
      im.style.height = '1.5rem'
      const te = document.createElement('div')
      el.addEventListener('click', () => {
        name1Input.value = name
        name1Suggestions.classList.add('hidden')
      })

      te.innerText = name
      el.appendChild(im)
      el.appendChild(te)
      name1Suggestions.appendChild(el)
    }
  }
})

name2Input.addEventListener('focus', () => {
  name2Suggestions.replaceChildren()

  for (const name of n) {
    if (name.toLowerCase().includes(name2Input.value.toLowerCase())) {
      const el = document.createElement('li')
      el.classList.add(
        ...'p-2 font-bold uppercase bg-zinc-100 hover:bg-zinc-200 cursor-pointer flex-1 gap-2'.split(
          ' '
        )
      )
      el.classList.add('flex', 'items-center')
      const im = document.createElement('div')
      im.style.background = `url('images/icons/${namesToInternal[name]}.png')`
      im.style.backgroundSize = 'contain'
      im.style.width = '1.5rem'
      im.style.height = '1.5rem'
      const te = document.createElement('div')
      el.addEventListener('click', () => {
        name2Input.value = name
        name2Suggestions.classList.add('hidden')
      })

      te.innerText = name
      el.appendChild(im)
      el.appendChild(te)
      name2Suggestions.appendChild(el)
    }
  }
})

name1Input.addEventListener('focus', () => {
  name1Suggestions.classList.remove('hidden')
  name2Suggestions.classList.add('hidden')
})

name2Input.addEventListener('focus', () => {
  name1Suggestions.classList.add('hidden')
  name2Suggestions.classList.remove('hidden')
})

submitButton.addEventListener('click', (e) => {
  e.preventDefault()
  if (!n.includes(name1Input.value)) {
    name1Input.setCustomValidity('Please select a valid fighter')
    name1Input.reportValidity('')
    return
  }
  name1Input.setCustomValidity('')

  if (!n.includes(name2Input.value)) {
    name2Input.setCustomValidity('Please select a valid fighter')
    name1Input.reportValidity('')
    return
  }
  name2Input.setCustomValidity('')

  if (name1Input.value === name2Input.value) {
    name1Input.setCustomValidity('Please select distinct fighters')
    name1Input.reportValidity('')
    return
  }

  window.location = `matchup/${namesToInternal[name1Input.value]}/${
    namesToInternal[name2Input.value]
  }`
})
