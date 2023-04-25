import { createRoot } from 'react-dom/client'
import MatchupFormInput from './components/MatchupFormInput'

document.body.style.overflow = 'overlay'

const domNode = document.getElementById('inputArea')
const root = createRoot(domNode)
root.render(<MatchupFormInput />)
