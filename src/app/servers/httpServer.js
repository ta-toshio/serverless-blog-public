const bodyParser = require('body-parser')
// import compression from 'compression'
// import helmet from 'helmet'
// import cors from 'cors'
const apiRoutes = require('./api')
const updateUserSession = require('./middlewares/updateUserSession')

const createHttpServer = (server, nextApp, firebase) => {

  const handle = nextApp.getRequestHandler()

  // server.disable('x-powered-by')
  // server.use(cors())
  // server.set('trust proxy', 1)
  // server.use(compression())
  // server.use(helmet())

  server.use(bodyParser.json())

  if (process.env.NODE_ENV !== 'production') {
    const fileUpload = require('express-fileupload')
    server.use(fileUpload())
  }

  server.use((req, res, next) => {
    req.firebase = firebase
    next()
  })

  server.use(updateUserSession)

  apiRoutes.forEach(apiRoute => {
    apiRoute({ server, firebase })
  })

  server.get('*', (req, res) => handle(req, res))

  return server
}

module.exports = createHttpServer