const next = require('next')
const express = require('express')
const admin = require('firebase-admin')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const createHttpServer = require('./httpServer')
const serviceAccount = require('./config/server')
const setting = require('../config/setting')

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: setting.firebase.databaseURL,
    storageBucket: setting.firebase.storageBucket,
  },
  'server'
)

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV === 'development'
const nextApp = next({ dev, dir: './src/app' })
const server = express()

server.use(
  session({
    secret: 'geheimnis',
    store: new FileStore({ path: './var/sessions', secret: 'geheimnis' }),
    resave: false,
    saveUninitialized: true,
  })
)

createHttpServer(server, nextApp, firebase)

nextApp.prepare().then(() => {
  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})