import CharacterFormInput from './components/CharacterFormInput'
import { createRoot } from 'react-dom/client'

document.body.style.overflow = 'overlay'

const domNode = document.getElementById('inputArea')
const root = createRoot(domNode)
root.render(<CharacterFormInput />)
