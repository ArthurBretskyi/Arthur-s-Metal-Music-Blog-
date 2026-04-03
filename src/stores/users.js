import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'
import { doc, getDoc } from 'firebase/firestore'
import db from '@/firebase-config'
import { createUserDoc } from '@/stores/helpers/createUserDoc'

export const useUsersStore = defineStore('users', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('users', generalApiOperation)

  async function checkUserExists(uid) {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      return docSnap.exists()
    } catch (e) {
      console.error('checkUserExists failed:', e)
      return false
    }
  }

  async function createUserWithUID(userData) {
    try {
      return await createUserDoc(userData)
    } catch (error) {
      console.error('Failed to create user with UID:', error)
      throw error
    }
  }

  async function getUserByUID(uid) {
    try {
      const ref = doc(db, 'users', uid)
      const snap = await getDoc(ref)
      return snap.exists() ? { id: uid, ...snap.data() } : null
    } catch (e) {
      console.error('getUserByUID failed:', e)
      return null
    }
  }

  return {
    ...base,
    checkUserExists,
    addUser: base.addItem,
    createUserWithUID,
    getUserByUID,
  }
})
