import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys)

const variants = {
  selected: ({ colorMode }: { colorMode: string }) =>
    definePartsStyle({
      container: {
        backgroundColor: colorMode === 'light' ? 'blue.100' : 'blue.800',
      },
    }),
}

export const Card = defineMultiStyleConfig({ variants })
