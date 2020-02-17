import React from 'react'
import {
  getPage,
} from '../../../domains/models/page'
import { redirect } from '../../../domains/miscs/redirect'
import Main from '../../../components/atoms/Main'
import Container from '../../../components/atoms/Container'
import EditorjsRender from '../../../components/editorjs/PresenterRender'

const Index = ({ page }) => {
  return (
    <Container>
      <Main>
        {page && (
          <article className="view-article article">
            <header className="view-article-header">
              <h1 className="text heading is-xxl">{page.title}</h1>
            </header>
            <div className="view-article-content wysiwyg">
              <EditorjsRender blocks={page.body} />
            </div>
          </article>
        )}
      </Main>
    </Container>
  )
}

Index.getInitialProps = async ({ res, query }) => {
  const id = query && query.id
  if (!id) {
    redirect('/', res)
  }
  const page = await getPage(id)
  if (!page) {
    // redirect('/', res)
  }
  return {
    page
  }
}

export default Index