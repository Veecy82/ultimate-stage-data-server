import { useEffect, useState } from 'react'
import useComponentVisible from '../useComponentVisible'
import namesToInternal from '../../public/scripts/namesToInternal.js'

const charNames = []
for (const name in namesToInternal) {
  charNames.push(name)
}
charNames.sort()

export default function CharacterSelector({ value, setValue, id }) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)

  const getFilteredChars = () => {
    return charNames.filter((char) =>
      char.toLowerCase().includes(value.toLowerCase())
    )
  }

  useEffect(() => {
    setCurrentIndex(-1)
  }, [isComponentVisible])

  return (
    <div className="relative" ref={ref}>
      <input
        id={id}
        onInput={(e) => {
          setValue(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault()
            if (currentIndex > -1) {
              setValue(getFilteredChars()[currentIndex])
            }
            setIsComponentVisible(false)
            e.target.blur()
          } else if (e.code === 'Tab') {
            if (isComponentVisible && getFilteredChars().length > 0) {
              e.preventDefault()
              setCurrentIndex((v) => (v + 1) % getFilteredChars().length)
            }
          } else if (e.code === 'ArrowDown') {
            e.preventDefault()
            setCurrentIndex((v) =>
              Math.min(v + 1, getFilteredChars().length - 1)
            )
          } else if (e.code === 'ArrowUp') {
            e.preventDefault()
            setCurrentIndex((v) => Math.max(v - 1, 0))
          } else if (e.code === 'Escape') {
            e.preventDefault()
            setIsComponentVisible(false)
            e.target.blur()
          }
        }}
        required
        value={value}
        type="text"
        className="w-full font-sans font-bold p-2 border-zinc-400 focus:outline-none focus:border-zinc-600 border-2"
      ></input>
      {isComponentVisible && (
        <ul className="absolute w-full z-10">
          {getFilteredChars().map((char, idx) => {
            return (
              <div
                key={idx}
                className={`w-full flex items-center p-2 font-bold uppercase ${
                  idx === currentIndex ? 'bg-zinc-200' : 'bg-zinc-100'
                } cursor-pointer flex-1 gap-2`}
                onMouseEnter={() => {
                  setCurrentIndex(idx)
                }}
                onClick={() => {
                  setValue(char)
                  setIsComponentVisible(false)
                }}
              >
                <div
                  className={`w-6 h-6 bg-contain`}
                  style={{
                    backgroundImage: `url('images/icons/${namesToInternal[char]}.png')`,
                  }}
                ></div>
                <div>{char}</div>
              </div>
            )
          })}
        </ul>
      )}
    </div>
  )
}
