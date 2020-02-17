import { Component } from 'react'
import Link from 'next/link'
import EditorjsRender from '../../../components/editorjs/PresenterRender'
import AuthContext from '../../../components/contexts/auth'
import { getPost, getPostUrl } from '../../../domains/models/post'
import { toDateFromSeconds } from '../../../domains/miscs/dateformat'
import { redirect } from '../../../domains/miscs/redirect'
import Main from '../../../components/atoms/Main'
import Container from '../../../components/atoms/Container'
import Image from '../../../components/atoms/Image'
import Tag from '../../../components/atoms/Tag'
import UserAvatar from '../../../modules/user/Avatar'

class View extends Component {

  static contextType = AuthContext

  static async getInitialProps({ res, query }) {
    const { id } = query
    const post = await getPost(id)
    if (!post) {
      redirect('/', res)
    }
    return { id, post }
  }

  render() {
    const { post } = this.props
    const { user } = this.context

    return (
      <Container>
        <Main>
          {user && (
            <Link
              href='/post/[id]/edit'
              as={`/post/${getPostUrl(post)}/edit`}
            >
              <button className="btn">Edit</button>
            </Link>
          )}
          {post && (
            <article className="view-article article">
              {post.image && (
                <figure className="article-featured-image">
                  <Link href='/post/[id]' as={`/post/${getPostUrl(post)}`}>
                    <a>
                      <Image src={post.image.url} className="featured-image" />
                    </a>
                  </Link>
                </figure>
              )}
              <header className="view-article-header">
                <h1 className="text heading is-xxl">{post.title}</h1>
                <div className="article-author">
                  {post.userId && post.userId.map(userId => (
                    <UserAvatar key={`user-avatar-${userId}`} id={userId} />
                  ))}
                  <div>{toDateFromSeconds(post.createdAt.seconds)}</div>
                </div>
                {post.tags && (
                  <div className="article-tags">
                    {post.tags && post.tags.map(tag => (
                      <Tag label={tag} key={tag} />
                    ))}
                  </div>
                )}
              </header>
              <div className="view-article-content wysiwyg">
                <EditorjsRender blocks={post.body} />
              </div>
            </article>
          )}
        </Main>
      </Container>
    )
  }
}

export default View