import React from 'react'
import firebase from '../../domains/services/firebase'
import AuthContext from '../contexts/auth'
import { login } from '../../domains/models/user'

class Auth extends React.Component {

  constructor(props) {
    super(props)

    this.setUser = user => {
      this.setState({ user: { ...this.state.user, ...user,  } })
    }

    this.state = {
      user: props.user || null,
      setUser: this.setUser
    }
  }

  componentDidMount() {
    firebase.auth && firebase.auth.onAuthStateChanged(user => {
      if (!user) {
        this.setState({ user: null })
        return fetch('/api/logout', {
          method: 'POST',
          credentials: 'same-origin'
        })
      }

      if(user.providerData.length === 1
        && user.providerData[0].providerId === 'password'
        && !user.emailVerified
      ) {
        this.setState({ user: null })
        return
      }

      return user
        .getIdToken()
        .then(token => {
          return login(token)
        })
        .then(res => {
          this.setState({ user: res.user })
        })
        .catch(e => {})
    })
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }

}

export default Auth