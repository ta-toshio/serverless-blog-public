import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostList from '../../components/organisms/PostList'
import AuthContext from './../../components/contexts/auth'
import {
  STATUS_PUBLIC,
  STATUS_PRIVATE,
  getPosts
} from '../../domains/models/post'
import SelectBarBox from './../../components/molecules/SelectBarbox'

export default class List extends Component {

  static contextType = AuthContext

  state = {
    posts: [],
    hasMorePosts: false,
    search: STATUS_PUBLIC,
  }

  static async getInitialProps(ctx) {
    // @TODO get user from redux and set orderBy
    const posts = await getPosts({ statusType: STATUS_PUBLIC })
    return { posts }
  }

  componentDidMount() {
    this.props.posts
      && this.props.posts.length > 0
      && this.setState({ posts: this.props.posts, hasMorePosts: true })
  }

  fetchMore = e => {
    const self = this
    const { posts, search } = this.state
    const { user } = this.context
    const orderBy = user ? 'createdAt' : 'publishedAt'

    this.setState({ hasMorePosts: false })
    const post = posts[posts.length - 1]
    if (!post) {
      return
    }

    getPosts({ [orderBy]: post[orderBy], statusType: search, orderBy })
      .then(morePosts => {
        if (morePosts.length > 0) {
          self.setState({ posts: [...posts, ...morePosts], hasMorePosts: true })
        }
      })
      .catch(e => {})
  }

  handleSearch = e => {
    const self = this
    const { search } = this.state

    this.setState({ hasMorePosts: false })
    getPosts({ statusType: search, orderBy: 'createdAt' })
      .then(posts => {
        self.setState({ posts })
        if (posts.length > 0) {
          self.setState({ hasMorePosts: true })
        }
      })
      .catch(e => {})
  }

  render() {
    const { user } = this.context
    const { posts, hasMorePosts, search } = this.state

    return (
      <>
        {user && (
          <div className="searchbox">
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
          </div>
        )}
        <InfiniteScroll
          dataLength={posts.length}
          next={this.fetchMore}
          hasMore={hasMorePosts}
          scrollThreshold={0.95}
        >
          <PostList posts={posts} user={user} />
        </InfiniteScroll>
      </>
    )
  }
}