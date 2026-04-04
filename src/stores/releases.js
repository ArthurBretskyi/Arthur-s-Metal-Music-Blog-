// ============================= Firestore

import { defineStore } from 'pinia'
import getStoreTemplate from '@/stores/helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useReleasesStore = defineStore('releases', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('releases', generalApiOperation)

  return {
    ...base,
    addNewRelease: base.addItem,
    updateRelease: base.updateItem,
  }
})

// =========================================Pinia

// import { defineStore } from 'pinia'
// import { ref } from 'vue'

// export const useReleasesStore = defineStore('releases', () => {
//   const releases = ref([
//     {
//       id: crypto.randomUUID(),
//       band: 'Kreator',
//       album: 'Krushers Of The World',
//       label: 'Nuclear Blast',
//       genre: ['Metal', 'Thrash Metal'],
//       date: 'January 16, 2026',
//       description: 'Some Text Here',
//       cover: '',
//     },
//     {
//       id: crypto.randomUUID(),
//       band: 'Megadeth',
//       album: 'Megadeth',
//       label: 'Tradecraft',
//       genre: ['Metal', 'Thrash Metal'],
//       date: 'February 05, 2026',
//       description: 'Some Text Here',
//       cover: '',
//     },
//     {
//       id: crypto.randomUUID(),
//       band: 'Mayhem',
//       album: 'Liturgy of Death',
//       label: 'Century Media Records',
//       genre: ['Black Metal'],
//       date: 'February 06, 2026',
//       description: 'Some Text Here',
//       cover: '',
//     },
//     {
//       id: crypto.randomUUID(),
//       band: 'Slagmaur',
//       album: 'Hulders Ritual ',
//       label: 'Prophecy Productions',
//       genre: ['Black Metal'],
//       date: 'February 27, 2026',
//       description: 'Some Text Here',
//       cover: '',
//     },
//   ])

//   const availableGenres = ref([
//     'Metal',
//     'Thrash Metal',
//     'Black Metal',
//     'Avant-garde Metal',
//     'Death Metal',
//     'Doom Metal',
//     'Industrial Metal',
//     'Progressive Metal',
//   ])

//   function addGenre(newGenre) {
//     if (availableGenres.value.includes(newGenre)) return
//     availableGenres.value.push(newGenre)
//   }

//   function addNewRelease(release) {
//     releases.value = [
//       ...releases.value,
//       {
//         id: crypto.randomUUID(),
//         ...release,
//       },
//     ]
//   }

//   function updateRelease(id, updatedRelease) {
//     releases.value = releases.value.map((release) => {
//       if (release.id === id) {
//         return { ...release, ...updatedRelease }
//       }
//       return release
//     })
//   }

//   return {
//     releases,
//     availableGenres,
//     addGenre,
//     addNewRelease,
//     updateRelease,
//   }
// })
