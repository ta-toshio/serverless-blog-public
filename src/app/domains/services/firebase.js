import googleFirebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import clientCredentials from '../../config/client'

if (!googleFirebase.apps.length) {
  googleFirebase.initializeApp(clientCredentials)
}

export const auth = googleFirebase.auth()
export const db = googleFirebase.firestore()
export const storage = googleFirebase.storage()
export const firebase = googleFirebase

export default {
  auth,
  db,
  storage,
  firebase,
}