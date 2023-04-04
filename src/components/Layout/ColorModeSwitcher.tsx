import { IconButton, IconButtonProps, useColorMode, useColorModeValue } from '@chakra-ui/react'
import * as React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue('dark', 'light')
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)
  const title = `Switch to ${text} mode`

  return (
    <IconButton
      size='sm'
      fontSize='sm'
      variant='ghost'
      color='current'
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={title}
      title={title}
      {...props}
    />
  )
}
