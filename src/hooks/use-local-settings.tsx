import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

export type FilterStatusTypes = 'all' | 'active' | 'downloading' | 'seeding' | 'paused' | 'finished' | 'error'
// I'd have loved to use `keyof typeof FilterStatusOptions` but I was getting weird type errors

export const FilterStatusOptions: { [key: string]: string } = {
  all: 'All',
  active: 'Active',
  downloading: 'Downloading',
  seeding: 'Seeding',
  paused: 'Paused',
  finished: 'Finished',
  error: 'Error',
}

type FiltersState = {
  status: FilterStatusTypes
  trackers: string[]
  labels: string[]
  name: string
}

const FiltersDefaultState: FiltersState = {
  status: 'all',
  trackers: [],
  labels: [],
  name: '',
}

type LayoutType = 'full' | 'compact'

const LayoutDefaultState: LayoutType = 'full'

const retrieveSetting = (setting: string) => {
  const val = localStorage.getItem(setting)
  if (!val) return

  try {
    const parsed = JSON.parse(val)
    return parsed
  } catch (e) {}

  return val
}

const storeSetting = (setting: string, value: any) => {
  let val = value
  if (typeof value === 'object') {
    val = JSON.stringify(value)
  }

  return localStorage.setItem(setting, val)
}

export const useLocalSettingsProvider = () => {
  const [fetchTorrentsTimeout, setFetchTorrentsTimeout] = useState<number>(3000)
  const [filters, setFilters] = useState<FiltersState>(FiltersDefaultState)
  const [storageLoaded, setStorageLoaded] = useState<boolean>(false)
  const [layout, setLayout] = useState<LayoutType>(LayoutDefaultState)

  const setFilter = (filter: keyof FiltersState, contents: string | string[]) => {
    const updated = {
      ...filters,
      [filter]: contents,
    }
    storeSetting('filters', updated)
    setFilters(updated)
  }

  useEffect(() => {
    if (storageLoaded) return

    let filters = retrieveSetting('filters')
    if (!filters) {
      filters = FiltersDefaultState
    }
    setFilters(filters as FiltersState)

    let layout = retrieveSetting('layout')
    if (!layout) {
      layout = LayoutDefaultState
    }
    setLayout(layout as LayoutType)

    setStorageLoaded(true)
  }, [storageLoaded])

  return {
    fetchTorrentsTimeout,
    filters,
    layout,
    setFetchTorrentsTimeout,
    setFilter,
    setLayout: (layout: LayoutType) => {
      storeSetting('layout', layout)
      setLayout(layout)
    },
  }
}

export type LocalSettingsState = ReturnType<typeof useLocalSettingsProvider>

export const LocalSettingsContext = createContext<LocalSettingsState | undefined>(undefined)
LocalSettingsContext.displayName = 'LocalSettingsContext'

export const useLocalSettings = () => {
  const ctxt = useContext(LocalSettingsContext)

  if (!ctxt) {
    throw new Error(
      'useLocalSettings returned `undefined`, maybe you forgot to wrap the component within <LocalSettingsProvider />?'
    )
  }

  return ctxt
}

type SettingsProviderComponentProps = {
  children?: ReactNode
}

export const LocalSettingsProvider = (props: SettingsProviderComponentProps) => {
  const value = useLocalSettingsProvider()

  return <LocalSettingsContext.Provider value={value} {...props} />
}
