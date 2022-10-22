import { useEffect, useState } from 'react'
import ResponsiveObserve, { ScreenMap } from '../../utils/responsiveObserve'

export default function useBreakpoint(): ScreenMap {
  const [screens, setScreens] = useState<ScreenMap>({})
  useEffect(() => {
    const token = ResponsiveObserve.subscribe(supportScrrens => {
      setScreens(supportScrrens)
    })
    return () => ResponsiveObserve.unsubscribe(token)
  }, [])
  return screens
}
