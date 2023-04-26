// this great user-defined hook was written by stackoverflow user Paul Fitzgerald:
// https://stackoverflow.com/a/45323523

import { useState, useEffect, useRef } from 'react'

export default function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsComponentVisible(false)
    } else {
      setIsComponentVisible(true)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return {
    containerRef,
    inputRef,
    isComponentVisible,
    setIsComponentVisible,
  }
}
