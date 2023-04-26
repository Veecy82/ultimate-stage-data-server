import { useState } from 'react'
import CharacterSelector from './CharacterSelector'
import LabeledCheckbox from './LabeledCheckbox'
import SmashButton from './SmashButton'

import namesToInternal, {
  namesToInternalCaseInsensitive,
} from '../../public/scripts/namesToInternal'

export default function CharacterFormInput() {
  const [name, setName] = useState('')
  const [onlineChecked, setOnlineChecked] = useState(true)
  const [offlineChecked, setOfflineChecked] = useState(true)

  return (
    <div className="flex flex-col gap-2 mt-4">
      <CharacterSelector value={name} setValue={setName} id="nameInput" />
      <LabeledCheckbox
        label="Include online games"
        id="online"
        checkedValue={onlineChecked}
        setCheckedValue={setOnlineChecked}
      />
      <LabeledCheckbox
        label="Include offline games"
        id="offline"
        checkedValue={offlineChecked}
        setCheckedValue={setOfflineChecked}
      />
      <SmashButton
        text="Go"
        onClick={(e) => {
          e.preventDefault()
          if (
            Object.keys(namesToInternal).some(
              (n) => n.toLowerCase() === name.toLowerCase()
            )
          ) {
            if (onlineChecked || offlineChecked) {
              let opts = ''
              if (!onlineChecked) {
                opts = '?only=offline'
              }
              if (!offlineChecked) {
                opts = '?only=online'
              }
              window.location.href = `/character/${namesToInternalCaseInsensitive(
                name
              )}${opts}`
            } else {
              const onlineBox = document.querySelector('#offline')
              onlineBox.setCustomValidity(
                'Please include either online or offline results'
              )
              onlineBox.reportValidity()
            }
          } else {
            const nameInput = document.querySelector('#nameInput')
            nameInput.setCustomValidity('Please enter the name of a fighter')
            nameInput.reportValidity()
          }
        }}
      />
    </div>
  )
}
