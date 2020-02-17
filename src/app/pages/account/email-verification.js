import { Component } from 'react'
import Router from 'next/router'
import { auth } from '../../domains/services/firebase'
import {
  toUserObject,
  createUser,
  login,
} from '../../domains/models/user'
import { getParameterByName } from '../../domains/miscs/url'
import { LoadingContext } from '../../components/contexts/Loading'
import LoggedInUserProvider from '../../components/hoc/LoggedInUserProvider'

class EmailVerification extends Component {

  static contextType = LoadingContext

  componentDidMount() {

    const mode = getParameterByName('mode')
    const actionCode = getParameterByName('oobCode')
    const continueUrl = getParameterByName('continueUrl')
    const lang = getParameterByName('lang') || 'en'

    switch (mode) {
      case 'verifyEmail':
        this.handleVerifyEmail(actionCode, continueUrl, lang)
        break
      default:
          Router.replace('/')
    }
  }

  handleVerifyEmail = (actionCode, continueUrl, lang) => {
    const { setUser } = this.props.user
    const { setIsLoading } = this.context
    setIsLoading(true)

    setTimeout(() => {// to get current user
      auth.applyActionCode(actionCode)
      .then(async () => {
        auth.currentUser.reload()
        setUser(toUserObject(auth.currentUser))
        await createUser(auth.currentUser)
        const token = await auth.currentUser.getIdToken()
        await login(token)
        setIsLoading(false)
        Router.replace('/account/email-verification-complete')

      }).catch(err => {
        console.log(err)
        setIsLoading(false)
        Router.replace('/account/email-verification-failed')
      })
    }, 2000)
  }

  render() {
    return (<div></div>)
  }
}

export default LoggedInUserProvider(EmailVerification)