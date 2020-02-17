import React from 'react'
import App, { Container } from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'
import LayoutApp from '../components/layouts/App'

Router.events.on('routeChangeStart', url => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

class MyApp extends App {

  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const user = ctx.req
      ? ctx.req.session.user
      : null

    return { pageProps, user }
  }

  render() {
    const { Component, pageProps, user } = this.props

    return (
      <Container>
        <LayoutApp user={user}>
          <Component {...pageProps} />
        </LayoutApp>
      </Container>
    )
  }
}

export default MyApp