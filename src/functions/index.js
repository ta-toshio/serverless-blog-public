import path from 'path'
import next from 'next'
import express from 'express'
import * as functions from 'firebase-functions'
import admin from 'firebase-admin'
import session from 'express-session'
import { FirestoreStore } from '@google-cloud/connect-firestore'
import { Firestore } from '@google-cloud/firestore'
import createHttpServer from './httpServer'
import serviceAccount from './config/server'

const setting = functions.config().setting

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: setting && setting.database_url || '',
    storageBucket: setting && setting.storage_bucket || '',
  },
  'server'
)

const dev = process.env.NODE_ENV === 'development'
const nextApp = next({
  dev,
  conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` }
})
const server = express()

server.use(
  session({
    store: new FirestoreStore({
      dataset: new Firestore({
        kind: 'express-sessions',
      }),
    }),
    name: '__session',
    secret: 'jf09jf+LKNS532ALnfksdn',
    resave: false,
    saveUninitialized: true,
  })
)

createHttpServer(server, nextApp, firebase)

const app = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare()
  return server(req, res)
})

export { app }