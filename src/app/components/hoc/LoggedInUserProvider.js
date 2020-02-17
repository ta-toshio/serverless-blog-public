import React from 'react'

import AuthContext from '../contexts/auth'

const Hoc = Component => {
  return class WrapComponent extends React.Component {
    
    static async getInitialProps (ctx) {
      const initialPageProps = Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}
      return {
        ...initialPageProps
      }
    }

    render() {
      return (
        <AuthContext.Consumer>
          {user => (
            <Component {...this.props} user={user} />
          )}
        </AuthContext.Consumer>
      )
    }
  }
}

export default Hoc