import Link from 'next/link'
import EditorjsTextRender from '../../components/editorjs/TextRenderer'
import { status, getPostUrl } from '../../domains/models/post'
import { toDateFromSeconds } from '../../domains/miscs/dateformat'
import Image from '../../components/atoms/Image'
import Tag from '../../components/atoms/Tag'
import UserAvatar from '../../modules/user/Avatar'

const PostList = ({ posts, user }) => (
  <>
    {posts && posts.map(post => (
      <article className="list-article group is-space" key={`post-${post.id}`}>
        <div className="list-article-tool">
          {user && (
            <>
              <span className="text list-article-tool-status">{status[post.status]}</span>
              <Link href='/post/[id]/edit' as={`/post/${getPostUrl(post)}/edit`}>
                <button className="btn">Edit</button>
              </Link>
            </>
          )}
        </div>
        <header className="list-article-header">
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
        <div className="list-article-main">
          {post.image && (
            <figure className="article-featured-image">
              <Link href='/post/[id]' as={`/post/${getPostUrl(post)}`}>
                <a>
                  <Image src={post.image.url} className="featured-image" />
                </a>
              </Link>
            </figure>
          )}
          <Link href='/post/[id]' as={`/post/${getPostUrl(post)}`}>
            <a className="heading text is-link-reverse is-xxl">
              <h1>{post.title}</h1>
            </a>
          </Link>
          <div className="texts">
            <EditorjsTextRender blocks={post.body} />
          </div>
        </div>
      </article>
    ))}
  </>
)

export default PostList