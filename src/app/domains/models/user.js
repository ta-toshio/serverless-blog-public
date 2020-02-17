import { auth, db, storage } from '../services/firebase'

export const toUserObject = user => {
  return {
    uid: user.uid,
    name: user.displayName,
    photoUrl: user.photoURL,
  }
}

export const createUser = async user => {
  await db.collection('users')
    .doc(user.uid)
    .set({
      uid: user.uid,
      name: user.displayName,
      photoUrl: user.photoURL || null,
      email: user.email,
      createdAt: new Date(),
    })
  return true
}

export const updateUserPhoto = async ({ uid, file }) => {
  if (!uid || !file) {
    return
  }
  const storageRef = storage.ref()
  const userPhotoRef = storageRef.child(`users/${uid}/profile`)
  const snapshot = await userPhotoRef.put(file)
  const downloadUrl = await snapshot.ref.getDownloadURL()
  return downloadUrl
}

export const deleteUserPhoto = async uid => {
  if (!uid) {
    return
  }
  const storageRef = storage.ref()
  const userPhotoRef = storageRef.child(`users/${uid}/profile`)
  return await userPhotoRef.delete()
}

export const updateUser = async ({ uid, name, photoUrl }) => {
  await db.collection('users')
    .doc(uid)
    .set({
      name,
      ...(photoUrl ? { photoUrl } : {}),
    }, { merge: true })
  return true
}

export const login = async token => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ token })
  })
  return response.json()
}

export const updateServerUserSessionData = async () => {
  const user = auth.currentUser
  return await user.getIdToken().then(token => login(token))
}