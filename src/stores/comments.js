import { defineStore } from 'pinia'
import getStoreTemplate from '@/stores/helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useCommentsStore = defineStore('comments', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('comments', generalApiOperation)

  return {
    ...base,
    addNewComment: base.addItem,
    updateComment: base.updateItem,
    removeComment: base.deleteItem,
    loadByRelease: (releaseId) => base.loadFilteredData('releaseId', '==', releaseId),
  }
})
