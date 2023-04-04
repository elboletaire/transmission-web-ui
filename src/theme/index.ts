import { extendTheme } from '@chakra-ui/react'
import { Progress } from './Progress'
import { Tag } from './Tag'

export const theme = extendTheme({
  components: {
    Tag,
    Progress,
  },
  colors: {
    spinner: '#77DD77',
  },
})
