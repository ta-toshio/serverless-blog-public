const setting = {
  siteName: 'Blog',
  maxNumOfUser: 1,
  heroImage: 'https://source.unsplash.com/oZPwn40zCK4/900x300',
  editorjs: {
    editorLinkEndPoint: '/api/url',
    editorImageFileEndPoint: '/api/upload-by-file',
    editorImageUrlEndPoint: '/api/upload-by-url',
  }
}

setting['firebase'] = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}

module.exports = setting