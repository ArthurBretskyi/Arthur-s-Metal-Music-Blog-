import { collection, addDoc } from 'firebase/firestore'
import db from '@/firebase-config'
import releases from './releases.json'
import genres from './genres.json'

async function seedCollection(collectionName, data) {
  const col = collection(db, collectionName)
  for (const item of data) {
    await addDoc(col, item)
  }
  console.log(`✅ ${collectionName}: ${data.length} documents added`)
}

export async function seedDatabase() {
  await seedCollection('releases', releases)
  await seedCollection('genres', genres)
  console.log('🎸 Database seeded successfully')
}
