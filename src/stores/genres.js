import { defineStore } from 'pinia'
import getStoreTemplate from '@/stores/helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useGenresStore = defineStore('genres', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('genres', generalApiOperation)

  return {
    ...base,
    addGenre: base.addItem,
  }
})
