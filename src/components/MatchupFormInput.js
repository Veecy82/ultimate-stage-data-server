import { useState } from 'react'
import CharacterSelector from './CharacterSelector'
import LabeledCheckbox from './LabeledCheckbox'
import SmashButton from './SmashButton'

import namesToInternal, {
  namesToInternalCaseInsensitive,
} from '../../public/scripts/namesToInternal'

export default function MatchupFormInput() {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [onlineChecked, setOnlineChecked] = useState(true)
  const [offlineChecked, setOfflineChecked] = useState(true)

  return (
    <div className="flex flex-col gap-2 mt-4">
      <CharacterSelector value={name1} setValue={setName1} id="name1Input" />
      <div className="uppercase text-sm font-bold">Versus</div>
      <CharacterSelector value={name2} setValue={setName2} id="name2Input" />
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
              (n) => n.toLowerCase() === name1.toLowerCase()
            )
          ) {
            if (
              Object.keys(namesToInternal).some(
                (n) => n.toLowerCase() === name2.toLowerCase()
              )
            ) {
              if (name1.toLowerCase() !== name2.toLowerCase()) {
                if (onlineChecked || offlineChecked) {
                  let opts = ''
                  if (!onlineChecked) {
                    opts = '?only=offline'
                  }
                  if (!offlineChecked) {
                    opts = '?only=offline'
                  }
                  window.location.href = `/matchup/${namesToInternalCaseInsensitive(
                    name1
                  )}/${namesToInternalCaseInsensitive(name2)}${opts}`
                } else {
                  const onlineBox = document.querySelector('#offline')
                  onlineBox.setCustomValidity(
                    'Please include either online or offline results'
                  )
                  onlineBox.reportValidity()
                }
              } else {
                const name2Input = document.querySelector('#name2Input')
                name2Input.setCustomValidity('Please enter distinct fighters')
                name2Input.reportValidity()
              }
            } else {
              const name2Input = document.querySelector('#name2Input')
              name2Input.setCustomValidity('Please enter the name of a fighter')
              name2Input.reportValidity()
            }
          } else {
            const name1Input = document.querySelector('#name1Input')
            name1Input.setCustomValidity('Please enter the name of a fighter')
            name1Input.reportValidity()
          }
        }}
      />
    </div>
  )
}
