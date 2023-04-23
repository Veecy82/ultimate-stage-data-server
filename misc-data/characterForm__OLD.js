import namesToInternal from '../public/scripts/namesToInternal.js'

const n = Object.keys(namesToInternal)
n.sort()
const nameInputArea = document.querySelector('.nameInputArea')
const nameInput = document.querySelector('.nameInput')
const nameSuggestions = document.querySelector('.nameSuggestions')
const submitButton = document.querySelector('.smashButtonLink')

document.body.style.overflow = 'overlay'

nameInputArea.addEventListener('click', (e) => {
  e.stopPropagation()
})

document.body.addEventListener('click', () => {
  nameSuggestions.classList.add('hidden')
})

nameInput.addEventListener('input', () => {
  nameSuggestions.replaceChildren()

  for (const name of n) {
    if (name.toLowerCase().includes(nameInput.value.toLowerCase())) {
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
        nameInput.value = name
        nameSuggestions.classList.add('hidden')
      })
      te.innerText = name
      el.appendChild(im)
      el.appendChild(te)
      nameSuggestions.appendChild(el)
    }
  }
})

nameInput.addEventListener('focus', () => {
  nameSuggestions.replaceChildren()

  for (const name of n) {
    if (name.toLowerCase().includes(nameInput.value.toLowerCase())) {
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
        nameInput.value = name
        nameSuggestions.classList.add('hidden')
      })
      te.innerText = name
      el.appendChild(im)
      el.appendChild(te)
      nameSuggestions.appendChild(el)
    }
  }
})

nameInput.addEventListener('focus', () => {
  nameSuggestions.classList.remove('hidden')
})

submitButton.addEventListener('click', (e) => {
  e.preventDefault()
  if (!n.includes(nameInput.value)) {
    nameInput.validity.valid = false
    nameInput.setCustomValidity('Please select a valid fighter')
  } else {
    window.location = `character/${namesToInternal[nameInput.value]}`
  }
})
