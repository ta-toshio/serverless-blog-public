import { firebase, db } from '../services/firebase'

export const getStatus = async ({ createdAt } = {}) => {
  let query = db.collection('statuses')
    .orderBy('createdAt', 'desc')
    .limit(20)

  if (createdAt) {
    query = query.startAfter(
      createdAt instanceof firebase.firestore.Timestamp
        ? createdAt
        : new firebase.firestore.Timestamp(createdAt.seconds, createdAt.nanoseconds)
    )
  }

  const statusSnapshot = await query.get()

  const statuses = []
  statusSnapshot.forEach((doc) => {
    statuses.push(doc.data())
  })
  return statuses
}

export const createStatus = async ({ body, userId }) => {
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()
  const docRef = await db.collection('statuses').doc()

  await docRef.set({
    id: docRef.id,
    body,
    userId,
    createdAt: serverTimestamp
  })
}

export const deleteStatus = async id => {
  await db.collection('statuses').doc(id).delete()
}
