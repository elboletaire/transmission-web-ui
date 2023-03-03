import { chakra, Tag, TagLabel, TagLeftIcon, TagProps } from '@chakra-ui/react'
import prettyBytes from 'pretty-bytes'
import { FaDownload, FaUpload } from 'react-icons/fa'
import { useTorrents } from '../../hooks/use-torrents'

const _DownloadSpeed = (props: TagProps) => {
  const { downloadSpeed } = useTorrents()

  return (
    <Tag {...props}>
      <TagLeftIcon as={FaDownload} />
      <TagLabel>{prettyBytes(downloadSpeed)}/s</TagLabel>
    </Tag>
  )
}

export const DownloadSpeed = chakra(_DownloadSpeed)
DownloadSpeed.displayName = 'DownloadSpeed'

const _UploadSpeed = (props: TagProps) => {
  const { uploadSpeed } = useTorrents()

  return (
    <Tag {...props}>
      <TagLeftIcon as={FaUpload} />
      <TagLabel>{prettyBytes(uploadSpeed)}/s</TagLabel>
    </Tag>
  )
}

export const UploadSpeed = chakra(_UploadSpeed)
UploadSpeed.displayName = 'UploadSpeed'
