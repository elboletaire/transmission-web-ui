import { tagAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys)

const sizes = {
  xs: definePartsStyle({
    container: {
      padding: '.1rem .4rem',
    },
    label: {
      fontSize: 'xs',
    },
  }),
}

const variants = {
  unbordered: definePartsStyle({
    container: {
      padding: 0,
      border: 'none',
    },
  }),
}

export const Tag = defineMultiStyleConfig({ variants, sizes })
