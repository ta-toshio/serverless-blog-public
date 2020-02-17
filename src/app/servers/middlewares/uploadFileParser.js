/**
 *  Firebase Functions messes with your request and will wreck your day because none of the
 *  traditional upload handlers with Express will work.
 *
 *  Credit: https://stackoverflow.com/questions/47242340/how-to-perform-an-http-file-upload-using-express-on-cloud-functions-for-firebase
 */
const Busboy = require('busboy');
const allowedMethods = ['POST', 'PUT'];
class FileUpload {
  constructor(opts) {
    this.fileName = opts.fileName;
    this.encoding = opts.encoding;
    this.mimeType = opts.mimeType;
    this.buffer = new Buffer('');
  }
  appendData(data) {
    this.buffer = Buffer.concat([this.buffer, data]);
  }
  getBuffer() {
    return this.buffer;
  }
  getBytes() {
    return this.buffer.byteLength;
  }
}

module.exports = function (req, res, next) {
  if (allowedMethods.includes(req.method) &&
    req.rawBody &&
    req.headers['content-type'].startsWith('multipart/form-data')) {

    const busboy = new Busboy({
      headers: req.headers
    });

    // Placeholder
    const files = {};
    req.body = {};

    // This callback will be invoked for each file uploaded
    busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
      // Note that os.tmpdir() is an in-memory file system, so should only 
      // be used for files small enough to fit in memory.
      files[fieldName] = new FileUpload({
        fileName: fileName,
        encoding: encoding,
        mimeType: mimeType
      });
      file.on('data', (data) => {
        files[fieldName].appendData(data);
      });
    });

    busboy.on('field', (fieldName, value) => {
      req.body[fieldName] = value;
    });

    // This callback will be invoked after all uploaded files are saved.
    busboy.on('finish', () => {
      req.files = files;
      next();
    });

    // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
    // a callback when it's finished.
    busboy.end(req.rawBody);

  } else {
    next();
  }
};