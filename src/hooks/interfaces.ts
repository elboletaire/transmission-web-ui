export interface Tracker {
  announce: string
  id: number
  scrape: string
  sitename: string
  tier: number
}

export interface Torrent {
  activityDate: number
  addedDate: number
  availability: []
  bandwidthPriority: number
  comment: string
  corruptEver: number
  creator: string
  dateCreated: number
  desiredAvailable: number
  doneDate: number
  downloadDir: string
  downloadedEver: number
  downloadLimit: number
  downloadLimited: boolean
  editDate: number
  error: number
  errorString: string
  eta: number
  etaIdle: number
  'file-count': number
  files: []
  fileStats: []
  group: string
  hashString: string
  haveUnchecked: number
  haveValid: number
  honorsSessionLimits: boolean
  id: number
  isFinished: boolean
  isPrivate: boolean
  isStalled: boolean
  labels: string[]
  leftUntilDone: number
  magnetLink: string
  manualAnnounceTime: number
  maxConnectedPeers: number
  metadataPercentComplete: number
  name: string
  'peer-limit': number
  peers: []
  peersConnected: number
  peersFrom: object
  peersGettingFromUs: number
  peersSendingToUs: number
  percentComplete: number
  percentDone: number
  pieces: string
  pieceCount: number
  pieceSize: number
  priorities: []
  'primary-mime-type': string
  queuePosition: number
  rateDownload: number
  rateUpload: number
  recheckProgress: number
  secondsDownloading: number
  secondsSeeding: number
  seedIdleLimit: number
  seedIdleMode: number
  seedRatioLimit: number
  seedRatioMode: number
  sizeWhenDone: number
  startDate: number
  status: number
  trackers: Tracker[]
  trackerList: string
  trackerStats: []
  totalSize: number
  torrentFile: string
  uploadedEver: number
  uploadLimit: number
  uploadLimited: boolean
  uploadRatio: number
  wanted: []
  webseeds: string[]
  webseedsSendingToUs: number
}

export const TorrentFields = [
  'activityDate',
  'addedDate',
  'availability',
  'bandwidthPriority',
  'comment',
  'corruptEver',
  'creator',
  'dateCreated',
  'desiredAvailable',
  'doneDate',
  'downloadDir',
  'downloadedEver',
  'downloadLimit',
  'downloadLimited',
  'editDate',
  'error',
  'errorString',
  'eta',
  'etaIdle',
  'file-count',
  'files',
  'fileStats',
  'group',
  'hashString',
  'haveUnchecked',
  'haveValid',
  'honorsSessionLimits',
  'id',
  'isFinished',
  'isPrivate',
  'isStalled',
  'labels',
  'leftUntilDone',
  'magnetLink',
  'manualAnnounceTime',
  'maxConnectedPeers',
  'metadataPercentComplete',
  'name',
  'peer-limit',
  'peers',
  'peersConnected',
  'peersFrom',
  'peersGettingFromUs',
  'peersSendingToUs',
  'percentComplete',
  'percentDone',
  'pieces',
  'pieceCount',
  'pieceSize',
  'priorities',
  'primary-mime-type',
  'queuePosition',
  'rateDownload',
  'rateUpload',
  'recheckProgress',
  'secondsDownloading',
  'secondsSeeding',
  'seedIdleLimit',
  'seedIdleMode',
  'seedRatioLimit',
  'seedRatioMode',
  'sizeWhenDone',
  'startDate',
  'status',
  'trackers',
  'trackerList',
  'trackerStats',
  'totalSize',
  'torrentFile',
  'uploadedEver',
  'uploadLimit',
  'uploadLimited',
  'uploadRatio',
  'wanted',
  'webseeds',
  'webseedsSendingToUs',
]

export const TorrentRequestFields = [
  'id',
  'downloadDir',
  'downloadedEver',
  'error',
  'errorString',
  'eta',
  'isFinished',
  'isStalled',
  'labels',
  'leftUntilDone',
  'metadataPercentComplete',
  'name',
  'peersConnected',
  'peersGettingFromUs',
  'peersSendingToUs',
  'percentDone',
  'queuePosition',
  'rateDownload',
  'rateUpload',
  'recheckProgress',
  'seedRatioLimit',
  'seedRatioMode',
  'sizeWhenDone',
  'status',
  'trackers',
  'uploadedEver',
  'uploadRatio',
  'webseedsSendingToUs',
]
