import { extendTheme } from '@chakra-ui/react'
import { Card } from './Card'
import { Progress } from './Progress'
import { Tag } from './Tag'

export const theme = extendTheme({
  components: {
    Card,
    Tag,
    Progress,
  },
  colors: {
    spinner: '#77DD77',
  },
})
