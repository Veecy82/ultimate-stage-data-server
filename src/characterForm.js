import CharacterSelector from './components/characterSelector'
import { createRoot } from 'react-dom/client'

console.log(`Hello ${'world'}`)

const domNode = document.getElementById('nameInputArea')
const root = createRoot(domNode)
root.render(<CharacterSelector />)
