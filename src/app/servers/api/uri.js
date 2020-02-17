const axios = require('axios')
const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-date')(),
  require('metascraper-image')(),
  // require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
  require('metascraper-youtube')(),
  require('metascraper-video')()
])

const urlApi = ({ server }) => {
  server.get('/api/url', async (req, res) => {
    const targetUrl = req.query.url
    if (!targetUrl) {
      return res.json({ success: 0 })
    }

    try {
      const encodeUri = encodeURI(targetUrl)
      const response = await axios.get(encodeUri)
      const metadata = await metascraper({ html: response.data, url: targetUrl })
      res.json({
        success: 1,
        meta: {
          title: metadata.title,
          description: metadata.description,
          image: {
            url: metadata.image || metadata.logo
          },
          video: {
            url: metadata.youtube || metadata.video
          }
        }
      })
    } catch (e) {
      return res.json({ success: 0 })
    }
  })
}

module.exports = {
  urlApi
}