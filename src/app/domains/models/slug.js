import { firebase, db } from '../services/firebase'
import ValidationError from '../errors/validationError'

export const getSlug = async slug => {
  const doc = await db.collection('slugs').doc(slug).get()
  return doc.exists ? doc.data() : null
}

export const createSlug = async (slug, postId) => {
  const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp()

  await db.collection(`slugs`).doc(slug).set({
    postId,
    createdAt: serverTimestamp,
    updatedAt: serverTimestamp,
  })
}

export const deleteSlug = async slug => {
  await db.collection('slugs').doc(slug).delete()
}

export const validateSlugUniq = async (slug, id) => {
  const message = 'Input slug has already been taken.'
  const slugData = await getSlug(slug)

  const throwError = () => {
    throw new ValidationError(message, [{ key: 'slug', message }])
  }

  if (!id && slugData) {
    throwError()
  }
  if (id && slugData && slugData.postId != id) {
    throwError()
  }
}