
const getExpiredTimestamp = () => Date.now() + (1000 * 60 * 60 * 24 * 31)

module.exports = {
  getExpiredTimestamp,
}