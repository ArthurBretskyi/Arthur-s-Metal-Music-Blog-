import { doc, getDoc, setDoc } from 'firebase/firestore'
import db from '@/firebase-config'

export async function createUserDoc(user, extraData = {}) {
  if (!user?.uid) throw new Error('UID is required to create user doc')

  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data()
  }

  let firstName = extraData.firstName || null

  if (user.displayName && !firstName) {
    const parts = user.displayName.split(' ')
    firstName ||= parts[0] || null
  }

  const username = extraData.username || (user.email ? user.email.split('@')[0] : null)

  const userDoc = {
    uid: user.uid,
    email: user.email || null,
    role: 'user',
    firstName,
    username,
    photoURL: user.photoURL || null,
    createdAt: new Date().toISOString(),
  }

  await setDoc(userRef, userDoc)

  return userDoc
}
