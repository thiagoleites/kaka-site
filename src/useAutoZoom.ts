import { useEffect, useState } from 'react'

export function useAutoZoom() {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const updateZoom = () => {
      const width = window.innerWidth

      if (width >= 2560) {
        setZoom(1.5)
      } else if (width >= 1920) {
        setZoom(1.3)
      } else if (width >= 1366) {
        setZoom(1)
      } else {
        setZoom(1)
      }
    }

    updateZoom()

    window.addEventListener('resize', updateZoom)

    return () => {
      window.removeEventListener('resize', updateZoom)
    }
  }, [])

  return zoom
}