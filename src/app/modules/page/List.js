import React, { Component } from 'react'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import PageList from '../../components/organisms/PageList'
import AuthContext from './../../components/contexts/auth'
import {
  STATUS_PUBLIC,
  STATUS_PRIVATE,
  getPages
} from '../../domains/models/page'
import SelectBarBox from './../../components/molecules/SelectBarbox'

export default class List extends Component {

  static contextType = AuthContext

  state = {
    pages: [],
    hasMorePages: false,
    search: STATUS_PUBLIC,
  }

  static async getInitialProps(ctx) {
    const pages = await getPages({ statusType: STATUS_PUBLIC })
    return { pages }
  }

  componentDidMount() {
    this.props.pages
      && this.props.pages.length > 0
      && this.setState({ pages: this.props.pages, hasMorePages: true })
  }

  fetchMore = e => {
    const self = this
    const { pages, search } = this.state
    const { user } = this.context
    const orderBy = user ? 'createdAt' : 'publishedAt'

    this.setState({ hasMorePages: false })
    const page = pages[pages.length - 1]
    if (!page) {
      return
    }

    getPages({ [orderBy]: page[orderBy], statusType: search, orderBy })
      .then(morePages => {
        if (morePages.length > 0) {
          self.setState({ pages: [...pages, ...morePages], hasMorePages: true })
        }
      })
      .catch(e => {})
  }

  handleSearch = e => {
    const self = this
    const { search } = this.state

    this.setState({ hasMorePages: false })
    getPages({ statusType: search, orderBy: 'createdAt' })
      .then(pages => {
        self.setState({ pages })
        if (pages.length > 0) {
          self.setState({ hasMorePages: true })
        }
      })
      .catch(e => {})
  }

  render() {
    const { user } = this.context
    const { pages, hasMorePages, search } = this.state

    return (
      <>
        {user && (
          <div className="searchbox actions">
            <SelectBarBox
              options={[
                {label: 'all', value: 'all'},
                {label: 'public', value: STATUS_PUBLIC},
                {label: 'private', value: STATUS_PRIVATE},
              ]}
              value={search}
              buttonLabel="Search"
              onChange={e => this.setState({ search: e.target.value })}
              onSearch={this.handleSearch.bind(this)}
            />
            <Link href='/page/add' as={`/page/add`}>
              <button className="btn">Add</button>
            </Link>
          </div>
        )}
        <InfiniteScroll
          dataLength={pages.length}
          next={this.fetchMore}
          hasMore={hasMorePages}
          scrollThreshold={0.95}
        >
          <PageList pages={pages} user={user} />
        </InfiniteScroll>
        <style jsx>{`
          .actions {
            display: flex;
            justify-content: space-between;
          }
        `}</style>
      </>
    )
  }
}