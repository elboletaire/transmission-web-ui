import {
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuProps,
  Portal,
  PortalProps,
  useEventListener,
} from '@chakra-ui/react'
import * as React from 'react'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import useLongPress from '../../hooks/use-long-press'

export interface ContextMenuProps<T extends HTMLElement> {
  renderMenu: () => JSX.Element | null
  children: (ref: MutableRefObject<T | null>) => JSX.Element | null
  menuProps?: Omit<MenuProps, 'children'> & { children?: React.ReactNode }
  portalProps?: Omit<PortalProps, 'children'> & { children?: React.ReactNode }
  menuButtonProps?: MenuButtonProps
}

export function ContextMenu<T extends HTMLElement = HTMLElement>(
  props: ContextMenuProps<T>
) {
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isDeferredOpen, setIsDeferredOpen] = useState(false)
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const targetRef = useRef<T>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsRendered(true)
        setTimeout(() => {
          setIsDeferredOpen(true)
        })
      })
    } else {
      setIsDeferredOpen(false)
      const timeout = setTimeout(() => {
        setIsRendered(isOpen)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  const contextmenu = (e: MouseEvent | TouchEvent) => {
    if (
      targetRef.current?.contains(e.target as any) ||
      e.target === targetRef.current
    ) {
      e.preventDefault()
      setIsOpen(true)
      if ('changedTouches' in e) {
        const [touch] = (e as TouchEvent).touches
        setPosition([touch.pageX, touch.pageY])
      } else {
        setPosition([e.pageX, e.pageY - (e.target as HTMLElement).offsetHeight])
      }
    } else {
      setIsOpen(false)
    }
  }
  const longpress = useLongPress(contextmenu, () => setIsOpen(false))

  useEventListener('contextmenu', contextmenu)
  useEventListener('touchstart', longpress.onTouchStart)
  useEventListener('touchend', longpress.onTouchEnd)

  const onCloseHandler = useCallback(() => {
    props.menuProps?.onClose?.()
    setIsOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.menuProps?.onClose])

  return (
    <>
      {props.children(targetRef)}
      {isRendered && (
        <Portal {...props.portalProps}>
          <Menu
            isOpen={isDeferredOpen}
            gutter={0}
            {...props.menuProps}
            onClose={onCloseHandler}
          >
            <MenuButton
              aria-hidden={true}
              w={1}
              h={1}
              style={{
                position: 'absolute',
                left: position[0],
                top: position[1],
                cursor: 'default',
              }}
              {...props.menuButtonProps}
            />
            {props.renderMenu()}
          </Menu>
        </Portal>
      )}
    </>
  )
}
