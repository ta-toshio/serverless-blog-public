import { db } from '../../domains/services/firebase'

const fetcher = () => {
  let users = {}
  let test = 0

  const fetch = async (uid) => {
    if (users[uid]) {
      return users[uid]
    }

    const doc = await db.collection('users')
      .doc(uid)
      .get()
    if (!doc.exists) {
      return null
    }
    const user = doc.data()
    users[user.uid] = user
    return user
  }

  const reset = () => {
    users = {}
  }

  const get = () => {
    return users
  }

  return {
    fetch,
    reset,
    get,
  }
}

export default fetcher()