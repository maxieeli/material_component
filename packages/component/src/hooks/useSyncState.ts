import { useRef } from 'react'
import useForceUpdate from './useForceUpdate'

type UseSyncStateProps<T> = [() => T, (newValue: T) => void]

export default function useSyncState<T>(initialValue: T): UseSyncStateProps<T> {
  const ref = useRef<T>(initialValue)
  const forceUpdate = useForceUpdate()

  return [
    () => ref.current,
    (newValue: T) => {
      ref.current = newValue
      forceUpdate()
    }
  ]
}
