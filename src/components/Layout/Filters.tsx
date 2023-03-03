import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { ChangeEvent } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import {
  FilterStatusOptions,
  FilterStatusTypes,
  useLocalSettings,
} from '../../hooks/use-local-settings'
import { useTorrents } from '../../hooks/use-torrents'

type Options = {
  label: string
  value: string
  colorScheme: string
}[]

const mapLabels = (value: string) => ({
  value,
  label: value,
  colorScheme: value === 'untagged' ? 'pink' : 'blue',
})

export const Filters = () => {
  const { labels, trackers } = useTorrents()
  const { filters, setFilter } = useLocalSettings()

  const selectLabels: Options = labels.map(mapLabels)

  selectLabels.push({
    label: 'untagged',
    value: 'untagged',
    colorScheme: 'pink',
  })

  return (
    <Stack direction={['column', 'column', 'row']}>
      <Text>Filter</Text>
      <Select
        size='sm'
        placeholder='Status'
        onChange={(e) => {
          if (!e?.value) {
            return
          }
          setFilter('status', e.value as FilterStatusTypes)
        }}
        options={Object.keys(FilterStatusOptions).map((k) => ({
          label: FilterStatusOptions[k],
          value: k,
        }))}
        value={{
          label: FilterStatusOptions[filters.status],
          value: filters.status as string,
        }}
      />
      <Select
        size='sm'
        placeholder='Trackers'
        onChange={(e: any) => {
          setFilter(
            'trackers',
            e.map(({ label }: { label: string }) => label)
          )
        }}
        options={trackers.map((t) => ({
          label: t.sitename,
          value: t.sitename,
        }))}
        isMulti
        value={filters.trackers.map((value) => ({ label: value, value }))}
      />
      <Select
        size='sm'
        placeholder='Labels'
        onChange={(e: any) => {
          setFilter(
            'labels',
            e.map(({ label }: { label: string }) => label)
          )
        }}
        options={selectLabels}
        isMulti
        value={filters.labels.map(mapLabels)}
      />
      <Box>
        <InputGroup>
          <Input
            size='sm'
            w='full'
            placeholder='by name'
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFilter('name', e.target.value)
            }}
            value={filters.name}
          />
          <InputRightElement width={8} height='auto' bottom={0}>
            <IconButton
              icon={<RiCloseFill />}
              aria-label='clear filter'
              title='clear filter'
              onClick={() => setFilter('name', '')}
              variant='ghost'
              size='xs'
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    </Stack>
  )
}
