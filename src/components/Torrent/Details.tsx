import {
  CloseButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import prettyBytes from 'pretty-bytes'
import { useTorrents } from '../../hooks/use-torrents'

export const Details = () => {
  const { list, selected, setSelected } = useTorrents()

  if (!selected) {
    return null
  }

  const torrent = Object.values(list).find(({ id }) => id === selected)
  if (!torrent) {
    return null
  }

  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>
          <CloseButton onClick={() => setSelected(null)} />
        </TableCaption>
        <Thead>
          <Tr>
            <Th colSpan={2}>Activity</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Have:</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Availability:</Td>
            <Td>{JSON.stringify(torrent.availability)}%</Td>
          </Tr>
          <Tr>
            <Td>Uploaded:</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Downloaded:</Td>
            <Td>{prettyBytes(torrent.downloadedEver)}</Td>
          </Tr>
          <Tr>
            <Td>Running time:</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Remaining:</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Last activity:</Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td>Error:</Td>
            <Td>{torrent.errorString}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
