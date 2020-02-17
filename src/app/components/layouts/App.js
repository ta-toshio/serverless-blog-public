import React from 'react'
import Auth from './Auth'
import Header from './Header'
import Footer from './Footer'
import Loading from '../contexts/Loading'

class App extends React.Component {

  render() {
    return (
      <Auth user={this.props.user}>
        <Loading>
          <Header />
          <div className="contents">
            {this.props.children}
          </div>
          <Footer />
        </Loading>
      </Auth>
    )
  }

}

export default App