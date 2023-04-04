import { useCallback, useRef, useState } from 'react'

const useLongPress = (
  onLongPress: (e: TouchEvent) => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 600 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeout = useRef<number>()
  const target = useRef<any>()

  const start = useCallback(
    (event: TouchEvent) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault as EventListener, {
          passive: false,
        })
        target.current = event.target
      }
      timeout.current = window.setTimeout(() => {
        onLongPress(event)
        setLongPressTriggered(true)
      }, delay)
    },
    [onLongPress, delay, shouldPreventDefault]
  )

  const clear = useCallback(
    (event: TouchEvent, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current)
      shouldTriggerClick && !longPressTriggered && onClick()
      setLongPressTriggered(false)
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault)
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  )

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: (e: TouchEvent) => clear(e, false),
    onTouchEnd: clear,
  }
}

const isTouchEvent = (event: TouchEvent) => {
  return 'touches' in event
}

const preventDefault = (event: TouchEvent) => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault()
  }
}

export default useLongPress
