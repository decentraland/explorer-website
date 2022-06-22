import { useEffect, useState } from "react"

export function useMobileResize(active: boolean = true) {
  const [ size, setSize ] = useState(() => ({ height: 0, width: 0 }))
  useEffect(() => {
    if (!active) {
      return
    }

    const root = document.getElementById('root')
    if (root) {
      root.className += ' full'
    }

    const resize = () => setSize({
      height: window.innerHeight,
      width: window.innerWidth,
    })

    resize()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (root) {
        root.className = root.className.replace(' full', '')
      }
    }
  }, [ active ])

  return size
}