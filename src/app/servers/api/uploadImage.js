const URL = require('url').URL
const uuidv4 = require('uuid/v4')
const image2base64 = require('image-to-base64')
const uploadFileParser = require('../middlewares/uploadFileParser')

const uploadImageByUrl = ({ server, firebase }) => {
  server.post('/api/upload-by-url', async (req, res) => {
    const url = req.body.url
    const parsedUrl = new URL(url)
    const filename = parsedUrl.pathname.split('/').pop()
    const bucket = firebase.storage().bucket()
    const file = bucket.file(filename)

    try {
      const base64Str = await image2base64(url)
      const imageBuffer = Buffer.from(base64Str, 'base64')
      await file.save(imageBuffer)
      await file.makePublic()
      const publicUrl = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2099',
      })
      return res.json({
        success: 1,
        file: {
          url: publicUrl
        }
      })
    } catch (e) {
      return res.json({ success: 0 })
    }
  })
}

const uploadImageByFile = async ({ server, firebase }) => {
  server.post('/api/upload-by-file', uploadFileParser, async (req, res) => {
    if (!req.files || Object.keys(req.files).length == 0) {
      return res.json({ success: 0 })
    }

    const image = req.files.image
    // const fileName = image.fileName || image.name
    const fileName = uuidv4()
    const blob = image.buffer || image.data

    const bucket = firebase.storage().bucket()

    const datePath = (new Date()).toISOString().slice(0,7).replace('-', '')
    const filePath = `posts/${datePath}/${fileName}`
    const file = bucket.file(filePath)
    await file.save(blob, async (err) => {
      if (err) {
        console.log(err)
        return res.json({ success: 0 })
      }
      await file.makePublic()
      const data = await file.get()
      const apifile = data[0]
      // const apiResponse = data[1]
      return res.json({
        success: 1,
        file: {
          url: apifile.metadata.mediaLink
        }
      })
    })
  })
}

module.exports = {
  uploadImageByUrl,
  uploadImageByFile
}