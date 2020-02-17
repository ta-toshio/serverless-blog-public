import { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { auth } from '../../domains/services/firebase'
import AuthContext from '../contexts/auth'
import DropdownMenu from '../atoms/DropdownMenu'
import { AccountCircle } from '../atoms/Icon'
import Avatar from './../../components/atoms/Avatar'
import { siteName } from '../../config/setting'

class Header extends Component {

  static contextType = AuthContext

  handleLogout () {
    auth.signOut()
      .then(() => {
        Router.replace('/')
      })
  }

  render() {
    const { user } = this.context

    return (
      <header className="header navbar is-middle">
        <Link href="/" >
          <a className="brand">{siteName}</a>
        </Link>
        <div className="navbar-button-group">
          <Link href="/murmur"><button className="btn is-melt">Murmur</button></Link>
          {user ? (
            <Link href="/post/add"><button className="btn is-melt">New Post</button></Link>
          ) : ''}
        </div>
        {user && (
          <DropdownMenu
            label={user.photoUrl
              ? <Avatar url={user.photoUrl} />
              : <AccountCircle height={48} width={48} />}
            items={[
              { label: <Link href="/account/setting"><a>Setting</a></Link> },
              { label: <Link href="/page/list"><a>Pages</a></Link> },
              { label: <span onClick={this.handleLogout}>Logout</span> }
            ]}
          />
        )}
      </header>
    )
  }
}

export default Header