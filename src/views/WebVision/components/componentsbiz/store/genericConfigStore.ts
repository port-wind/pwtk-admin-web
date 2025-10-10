// src/stores/genericConfigStore.js
import { atom } from 'nanostores'

interface IGenericConfigStore {
  config: Record<string, any>
  settings: Record<string, any>
}

export const genericConfigStore = atom<IGenericConfigStore>({
  config: {},
  settings: {}
})

export function setConfig(key: string, value: any) {
  genericConfigStore.set({
    ...genericConfigStore.get(),
    config: {
      ...genericConfigStore.get().config,
      [key]: value
    }
  })
}

export function setSetting(key: string, value: any) {
  genericConfigStore.set({
    ...genericConfigStore.get(),
    settings: {
      ...genericConfigStore.get().settings,
      [key]: value
    }
  })
}

export function getConfig(key: string) {
  return genericConfigStore.get().config[key]
}

export function getSetting(key: string) {
  return genericConfigStore.get().settings[key]
}
export function useGenericConfigStore() {
  return {
    genericConfigStore,
    setConfig,
    setSetting,
    getConfig,
    getSetting
  }
}
