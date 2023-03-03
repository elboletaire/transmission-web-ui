import { progressAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(progressAnatomy.keys)

const sizes = {
  xxs: definePartsStyle({
    track: {
      height: '2px',
    },
  }),
}

export const Progress = defineMultiStyleConfig({ sizes })
