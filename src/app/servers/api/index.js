const { urlApi } = require('./uri')
const { uploadImageByUrl, uploadImageByFile } = require('./uploadImage')
const { getExpiredTimestamp } = require('./../utils')

const loginApi = ({ server, firebase }) => {
  server.post('/api/login', (req, res) => {
    if (!req.body) return res.sendStatus(400)

    const token = req.body.token
    firebase
      .auth()
      .verifyIdToken(token)
      .then(async decodedToken => {
        req.session.decodedToken = decodedToken

        const db = firebase.firestore()
        const doc = await db.collection('users').doc(decodedToken.uid).get()
        const user = doc.exists ? doc.data() : null

        const sessionUserData = {
          uid: user.uid,
          name: user && user.name || '',
          photoUrl: user && user.photoUrl || '',
          expired: getExpiredTimestamp(),
        }

        // @see domains/models/user
        req.session.user = sessionUserData

        return { sessionUserData, decodedToken }
      })
      .then(({ sessionUserData, decodedToken }) => 
        res.json({ status: true, decodedToken, user: sessionUserData }))
      .catch(error => res.json({ error }))
  })
}

const logoutApi = ({ server }) => {
  server.post('/api/logout', (req, res) => {
    req.session.decodedToken = null
    req.session.user = null
    res.json({ status: true })
  })
}

module.exports = [
  loginApi,
  logoutApi,
  urlApi,
  uploadImageByUrl,
  uploadImageByFile,
]