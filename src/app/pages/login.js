import { Component } from 'react'
import { firebase, db } from '../domains/services/firebase'
import { createUser } from '../domains/models/user'
import Container from '../components/atoms/Container'
import Main from '../components/atoms/Main'
import { maxNumOfUser } from '../config/setting'

class Login extends Component {

  state = {
    emailVerification: false,
    error: false,
  }

  componentDidMount() {
    const self = this

    // const firebaseui = require("firebaseui-ja")
    const firebaseui = require("firebaseui")
    var uiConfig = {
      // Url to redirect to after a successful sign-in.
      'signInSuccessUrl': '/',
      'callbacks': {
        'signInSuccessWithAuthResult': async function(authResult, redirectUrl) {
          const user = authResult.user
          const credential = authResult.credential
          const isNewUser = authResult.additionalUserInfo.isNewUser
          const providerId = authResult.additionalUserInfo.providerId
          const operationType = authResult.operationType

          const userSnap = await db.collection('users').get()
          if (userSnap.size > maxNumOfUser) {
            alert('Error: num of user over limit')
            return false
          }

          if (providerId === 'password' && !user.emailVerified) {
            user.sendEmailVerification()
              .then(()=>{
                self.setState({ emailVerification: true })
              })
              .catch((error)=>{
                self.setState({ error: error.code })
              })
            return false
          }

          if (isNewUser
            && (providerId === 'google.com' || providerId === 'twitter.com')
          ) {
            createUser(user)
              .then(() => {
                return true
              })
              .catch(err => {
                console.log(err)
              })
          }

          return true
        }
      },
      'signInOptions': [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
      ],
    }
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }

  render() {
    const { emailVerification, error } = this.state

    return (
      <Container>
        <Main>
          <div id="firebaseui-auth-container"></div>
          {emailVerification && (
            <div className="alert">
              <span className="text">
                確認メールを送信しました。
                メール内のリンクから登録を完了してください。
              </span>
            </div>
          )}
          {error && error === 'auth/too-many-requests' && (
            <div className="alert is-danger">
              <span className="text">
                少し多めのリクエストを検知しました。
                ご不便おかけしますが少し時間が経ってからお試しください。
              </span>
            </div>
          )}
        </Main>
      </Container>
    )
  }
}

export default Login