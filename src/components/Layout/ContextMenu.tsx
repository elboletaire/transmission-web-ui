import { Menu, MenuButton, MenuButtonProps, MenuProps, Portal, PortalProps, useEventListener } from '@chakra-ui/react'
import { MutableRefObject, ReactNode, useCallback, useRef, useState } from 'react'
import useLongPress from '../../hooks/use-long-press'

export interface ContextMenuProps<T extends HTMLElement> {
  renderMenu: () => JSX.Element | null
  children: (ref: MutableRefObject<T | null>) => JSX.Element | null
  menuProps?: Omit<MenuProps, 'children'> & { children?: ReactNode }
  portalProps?: Omit<PortalProps, 'children'> & { children?: ReactNode }
  menuButtonProps?: MenuButtonProps
}

export function ContextMenu<T extends HTMLElement = HTMLElement>(props: ContextMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<[number, number]>([0, 0])
  const targetRef = useRef<T>(null)

  const contextmenu = (e: MouseEvent | TouchEvent) => {
    if (targetRef.current?.contains(e.target as any) || e.target === targetRef.current) {
      e.preventDefault()
      if ('touches' in e) {
        const [touch] = (e as TouchEvent).touches
        setPosition([touch.pageX, touch.pageY])
      } else {
        setPosition([e.pageX, e.pageY])
      }
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }
  const longpress = useLongPress(contextmenu, () => {})

  useEventListener('touchstart', longpress.onTouchStart)
  useEventListener('touchend', longpress.onTouchEnd)
  useEventListener('contextmenu', contextmenu)

  const onCloseHandler = useCallback(() => {
    props.menuProps?.onClose?.()
    setIsOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.menuProps?.onClose])

  return (
    <>
      {props.children(targetRef)}
      <Portal {...props.portalProps}>
        <Menu isOpen={isOpen} gutter={0} {...props.menuProps} onClose={onCloseHandler} isLazy>
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
    </>
  )
}
