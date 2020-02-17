import { firebase, db } from '../services/firebase'

export const searchTag = async input => {
  let query = db.collection('tags').limit(20)

  if (input) {
    query = query.where('label', '==', input)
  } else {
    query = query.orderBy('label', 'desc')
  }

  const tagsSnapshot = await query.get()

  const tags = []
  tagsSnapshot.forEach(doc => {
    tags.push(doc.data())
  })
  return tags
}

export const createTag = tags => {
  if (!tags || !tags.length) {
    return
  }

  tags.forEach(async tag => {
    const doc = await db.collection('tags').doc(tag.label).get()
    if (!doc.exists) {
      await db.collection('tags').doc(tag.label).set({
        label: tag.label,
        value: tag.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
    }
  })
}
