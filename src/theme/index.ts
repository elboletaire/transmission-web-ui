import { extendTheme } from '@chakra-ui/react'
import { Card } from './Card'
import { Modal } from './Modal'
import { Progress } from './Progress'
import { Tabs } from './Tabs'
import { Tag } from './Tag'

export const theme = extendTheme({
  components: {
    Card,
    Modal,
    Tabs,
    Tag,
    Progress,
  },
  colors: {
    spinner: '#77DD77',
  },
})
