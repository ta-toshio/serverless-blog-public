function ValdiationError(message, errors) {
  this.message = message
  this.name = 'ValdiationError'
  this.errors = errors
}

ValdiationError.prototype.toString = function() {
  return this.name + ': "' + this.message + '"';
}

export default ValdiationError