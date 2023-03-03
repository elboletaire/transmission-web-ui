import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { TbLayoutList, TbLayoutRows } from 'react-icons/tb'
import { useLocalSettings } from '../../hooks/use-local-settings'

export const SettingsLayout = (props: Omit<IconButtonProps, 'aria-label'>) => {
  const { layout, setLayout } = useLocalSettings()
  const label = layout === 'compact' ? 'full' : 'compact'
  const Icon = layout === 'compact' ? TbLayoutList : TbLayoutRows
  const title = `Switch to ${label} view`

  return (
    <IconButton
      size='sm'
      variant='ghost'
      aria-label={title}
      title={title}
      icon={<Icon />}
      onClick={() => setLayout(label)}
      {...props}
    />
  )
}
