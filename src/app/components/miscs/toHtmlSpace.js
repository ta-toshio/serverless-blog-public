
module.exports = function(str) {
  if (!str) {
    return str
  }
  return str.replace(/ /g, '\u00a0')
}