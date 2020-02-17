import React, { useState, useEffect, useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { redirect } from '../../../domains/miscs/redirect'
import { getPosts, STATUS_PUBLIC } from '../../../domains/models/post'
import AuthContext from '../../../components/contexts/auth'
import Container from '../../../components/atoms/Container'
import Main from '../../../components/atoms/Main'
import PostList from '../../../components/organisms/PostList'

const usePosts = ({ tag, defaultPosts }) => {
  const [ posts, setPosts ] = useState(defaultPosts)
  const [ hasMorePosts, setHasMorePosts ] = useState(false)

  const fetchMorePosts = async e => {
    const post = posts[posts.length - 1]
    if (!post) {
      return
    }
    const _posts = await getPosts({
      publishedAt: post.publishedAt,
      statusType: STATUS_PUBLIC,
      tag
    })
    if (_posts.length > 0) {
      setPosts([...posts, ..._posts])
      setHasMorePosts(true)
    }
  }

  useEffect(() => {
    setPosts(defaultPosts)
    setHasMorePosts(true)
  }, [ defaultPosts ])

  return {
    posts,
    setPosts,
    fetchMorePosts,
    hasMorePosts,
  }
}

const Index = ({ tag, defaultPosts = [] }) => {
  const { posts, fetchMorePosts, hasMorePosts } = usePosts({ tag, defaultPosts })
  const { user } = useContext(AuthContext)

  return (
    <Container>
      <Main>
        <header>
          <h1 className="is-xxl"># {tag}</h1>
        </header>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMorePosts}
          scrollThreshold={0.95}
        >
          <PostList posts={posts} user={user} />
        </InfiniteScroll>
      </Main>
    </Container>
  )
}

Index.getInitialProps = async ({ req, res, query }) => {
  const { id } = query
  if (!id) {
    redirect('/', res)
  }

  const defaultPosts = await getPosts({ tag: id, statusType: STATUS_PUBLIC })

  return { tag: id, defaultPosts }
}

export default Index