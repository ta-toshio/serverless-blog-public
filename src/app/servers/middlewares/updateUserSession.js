const { getExpiredTimestamp } = require('./../utils')

module.exports = (req, res, next) => {
  if (
    !(
      req.path.match(/^\/_next\//) ||
      req.path.match(/^\/static\//) ||
      req.path.match(/^\/api\//)
    )
  ) {
    const user = req.session.user
    if (user) {
      const expired = user.expired || 0
      if (expired > Date.now()) {
        req.session.user = {
          ...user,
          expired: getExpiredTimestamp(),
        }
      } else {
        req.session.user = null
      }
    } else {
      req.session.user = null
    }
  }

  next()
}