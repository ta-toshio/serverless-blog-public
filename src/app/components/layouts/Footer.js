import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Main from '../../components/atoms/Main'
import Container from '../../components/atoms/Container'
import { getPages, getPageUrl } from '../../domains/models/page'

const usePages = () => {
  const [ pages, setPages ] = useState(null)

  useEffect(() => {
    const fetchPages = async () => {
      const _pages = await getPages()
      setPages(_pages)
    }

    fetchPages()

  }, [])

  return {
    pages
  }
}

const Footer = () => {

  const { pages } = usePages()

  return (
    <>
      <footer>
        <Container>
          <Main>
            <ul>
              {pages && pages.map(page => (
                <li key={page.id}>
                  <Link href='/page/[id]' as={`/page/${getPageUrl(page)}`}>
                    <a>{page.title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </Main>
        </Container>
      </footer>
      <style jsx>{`
        footer {
          padding: 1em;
        }
        li {
          margin-bottom: 1em;
        }
    `}</style>
    </>
  )
}

export default Footer