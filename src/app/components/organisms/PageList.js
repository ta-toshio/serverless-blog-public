import Link from 'next/link'
import EditorjsTextRender from '../../components/editorjs/TextRenderer'
import { status, getPageUrl } from '../../domains/models/page'
import { toDateFromSeconds } from '../../domains/miscs/dateformat'
import UserAvatar from '../../modules/user/Avatar'

const PageList = ({ pages, user }) => (
  <>
    {pages && pages.map(page => (
      <article className="list-article group is-space" key={`page-${page.id}`}>
        <div className="list-article-tool">
          {user && (
            <>
              <span className="text list-article-tool-status">{status[page.status]}</span>
              <Link href='/page/[id]/edit' as={`/page/${getPageUrl(page)}/edit`}>
                <button className="btn">Edit</button>
              </Link>
            </>
          )}
        </div>
        <header className="list-article-header">
          <div className="article-author">
            {page.userId && page.userId.map(userId => (
              <UserAvatar key={`user-avatar-${userId}`} id={userId} />
            ))}
            <div>{toDateFromSeconds(page.createdAt.seconds)}</div>
          </div>
        </header>
        <div className="list-article-main">
          <Link href='/page/[id]' as={`/page/${getPageUrl(page)}`}>
            <a className="heading text is-link-reverse is-xxl">
              <h1>{page.title}</h1>
            </a>
          </Link>
          <div className="texts">
            <EditorjsTextRender blocks={page.body} />
          </div>
        </div>
      </article>
    ))}
  </>
)

export default PageList