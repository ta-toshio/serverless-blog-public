import Router from 'next/router'

function serverRedirect(res, statusCode = 302, location = '/') {
  if (!res) {
    throw new Error('Response object required')
  }

  if (!statusCode) {
    throw new Error('Status code required')
  }

  if (!location) {
    throw new Error('Location required')
  }

  res.writeHead(statusCode, {'Location': location})
  res.end()
}

function clinetRedirect() {
  Router.replace(target)
}

function redirect(target, res, status) {
  if (res) {
    serverRedirect(res, status, target)
  } else {
    clinetRedirect(target)
  }
}

export {
  redirect,
  clinetRedirect,
  serverRedirect,
}