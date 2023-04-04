import { Reducer, useReducer } from 'react'
import { Torrent, Tracker } from './interfaces'
import { TorrentStatus } from './use-torrent'

export const FetchAction = 'torrents:fetch'
export const RemoveAction = 'torrents:remove'
export const RenameAction = 'torrents:rename'
export const SetLabelsAction = 'torrents:setLabels'
export const StartAction = 'torrents:start'
export const StopAction = 'torrents:pause'

export type TorrentsList = {
  [id: number]: Torrent
}

export interface TorrentsState {
  ids: number[]
  list: TorrentsList
  loading: boolean
  loaded: boolean
  downloadSpeed: number
  uploadSpeed: number
  trackers: Tracker[]
  labels: string[]
}

export const EmptyTorrentsState: TorrentsState = {
  ids: [],
  list: {},
  loading: false,
  loaded: false,
  downloadSpeed: 0,
  uploadSpeed: 0,
  trackers: [],
  labels: [],
}

export type SetPayload = {
  torrents: Torrent[]
  removed?: number[]
}
export type IdsPayload = {
  ids: number[]
}
export type RenamePayload = IdsPayload & {
  name: string
  path: string
}
export type SetLabelsPayload = IdsPayload & {
  labels: string[]
}

export type TorrentsActionType =
  | typeof FetchAction
  | typeof RenameAction
  | typeof RemoveAction
  | typeof SetLabelsAction
  | typeof StopAction
  | typeof StartAction

export type TorrentsActionPayload = SetPayload | IdsPayload | SetLabelsPayload | RenamePayload
export type TorrentsAction = {
  type: TorrentsActionType
  payload?: TorrentsActionPayload
}

const calculateDownloadSpeed: (torrents: Torrent[]) => number = (torrents) =>
  torrents.reduce((acc, torrent) => acc + torrent.rateDownload, 0)

const calculateUploadSpeed: (torrents: Torrent[]) => number = (torrents) =>
  torrents.reduce((acc, torrent) => acc + torrent.rateUpload, 0)

const extractUniqueLabels: (torrents: Torrent[]) => string[] = (torrents) =>
  [...new Set(torrents.reduce((acc, tor) => [...acc, ...tor.labels], [] as string[]))].sort()

const extractIds: (torrents: Torrent[]) => number[] = (torrents) => torrents.map((torrent) => torrent.id)

const extractUniqueTrackers: (torrents: Torrent[]) => Tracker[] = (torrents) =>
  torrents
    .reduce((acc, torrent) => {
      torrent.trackers.forEach((tracker) => {
        if (!acc.find((tr) => tr.sitename === tracker.sitename)) {
          acc.push(tracker)
        }
      })

      return acc
    }, [] as Tracker[])
    .sort((a, b) => (a.sitename > b.sitename ? 1 : a.sitename < b.sitename ? -1 : 0))

const removeTorrents = (state: TorrentsState, payloadIds: number[]) => {
  const ids: number[] = [...state.ids]
  const list: TorrentsList = { ...state.list }

  payloadIds.forEach((id) => {
    if (list[id]) {
      delete list[id]
    }
    ids.splice(ids.indexOf(id), 1)
  })

  return { ids, list }
}

export const torrentsReducer: Reducer<TorrentsState, TorrentsAction> = (
  state: TorrentsState,
  action: TorrentsAction
) => {
  switch (action.type) {
    case StartAction:
    case StopAction: {
      const { ids } = action.payload as IdsPayload
      const { list } = state
      ids.forEach((id) => {
        list[id].status = action.type === StopAction ? TorrentStatus.Stopped : TorrentStatus.DownloadWait
      })

      return {
        ...state,
        list,
      }
    }

    case FetchAction: {
      const { torrents } = action.payload as SetPayload
      const list: TorrentsList = { ...state.list }

      torrents.forEach((tor) => {
        list[tor.id] = tor
      })

      const tlist = Object.values(list)
      const ids = extractIds(tlist)
      const trackers = extractUniqueTrackers(tlist)
      const labels = extractUniqueLabels(tlist)
      const downloadSpeed = calculateDownloadSpeed(tlist)
      const uploadSpeed = calculateUploadSpeed(tlist)

      return {
        ...state,
        ids,
        labels,
        list,
        downloadSpeed,
        uploadSpeed,
        trackers,
      }
    }

    case SetLabelsAction: {
      const payload = action.payload as SetLabelsPayload
      const { labels, list } = state

      // add new labels to list
      payload.labels.forEach((label) => {
        if (!labels.includes(label)) {
          labels.push(label)
        }
      })
      labels.sort()

      // update torrents' labels state
      payload.ids.forEach((id) => {
        list[id].labels = payload.labels
      })

      return {
        ...state,
        labels,
        list,
      }
    }

    case RenameAction: {
      const { ids, name } = action.payload as RenamePayload
      const { list } = state
      ids.forEach((id) => {
        list[id].name = name
      })
      return {
        ...state,
        list,
      }
    }

    case RemoveAction: {
      const { ids } = action.payload as IdsPayload
      return {
        ...state,
        ...removeTorrents(state, ids),
      }
    }
  }

  return state
}

export const useTorrentsReducer = () => {
  const [torrents, dispatch] = useReducer(torrentsReducer, EmptyTorrentsState)

  return {
    start: (ids: number[]) =>
      dispatch({
        type: StartAction,
        payload: { ids },
      }),
    stop: (ids: number[]) =>
      dispatch({
        type: StopAction,
        payload: { ids },
      }),
    rename: (ids: number[], name: string) =>
      dispatch({
        type: RenameAction,
        payload: { ids, name },
      }),
    remove: (ids: number[]) =>
      dispatch({
        type: RemoveAction,
        payload: { ids },
      }),
    set: (payload: SetPayload) =>
      dispatch({
        type: FetchAction,
        payload,
      }),
    setLabels: (ids: number[], labels: string[]) =>
      dispatch({
        type: SetLabelsAction,
        payload: { ids, labels },
      }),
    torrents,
  }
}
