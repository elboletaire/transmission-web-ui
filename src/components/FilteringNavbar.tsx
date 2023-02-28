import { Box, Input, Stack, Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import prettyBytes from 'pretty-bytes'
import { ChangeEvent } from 'react'
import { FaDownload, FaUpload } from 'react-icons/fa'
import { ColorModeSwitcher } from '../ColorModeSwitcher'
import { FilterTypes, useClientContext } from '../hooks/use-rpc-reducer'

export const FilteringNavbar = () => {
  const {
    downloadSpeed,
    labels,
    setFilterStatus,
    setFilterLabels,
    setFilterTrackers,
    setFilterText,
    trackers,
    uploadSpeed,
  } = useClientContext()
  const options = {
    all: 'All',
    active: 'Active',
    downloading: 'Downloading',
    seeding: 'Seeding',
    paused: 'Paused',
    finished: 'Finished',
  } as any

  return (
    <Box>
      <Stack direction='row' alignContent={'stretch'}>
        <Text>Filter</Text>
        <Box>
          <Select
            size='sm'
            placeholder='Status'
            onChange={(e) => {
              if (!e?.value) {
                return
              }
              setFilterStatus(e.value as FilterTypes)
            }}
            options={Object.keys(options).map((k) => ({
              label: options[k],
              value: k,
            }))}
          />
        </Box>
        <Box>
          <Select
            size='sm'
            placeholder='Trackers'
            onChange={(e: any) => {
              setFilterTrackers(e.map(({label}: {label: string}) => label))
            }}
            options={trackers.map((t) => ({
              label: t.sitename,
              value: t.sitename,
            }))}
            isMulti
          />
        </Box>
        <Box>
          <Select
            size='sm'
            placeholder='Labels'
            onChange={(e: any) => {
              setFilterLabels(e.map(({label}: {label: string}) => label))
            }}
            options={labels.map((l) => ({
              label: l,
              value: l,
            }))}
            isMulti
          />
        </Box>
        <Box>
          <Input
            size='sm'
            placeholder='by name'
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setFilterText(e.target.value)
            }}
          />
        </Box>
        <Stack direction='row' justifyContent='end' flex='auto'>
          <Tag size='sm'>
            <TagLeftIcon as={FaDownload} />
            <TagLabel>{prettyBytes(downloadSpeed)}/s</TagLabel>
          </Tag>
          <Tag size='sm'>
            <TagLeftIcon as={FaUpload} />
            <TagLabel>{prettyBytes(uploadSpeed)}/s</TagLabel>
          </Tag>
        </Stack>
        <ColorModeSwitcher />
      </Stack>
    </Box>
  )
}
