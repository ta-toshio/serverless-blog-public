import React from 'react'
import Container from '../components/atoms/Container'
import Main from '../components/atoms/Main'
import Hero from '../components/organisms/Hero'
import PostList from '../modules/post/List'
import { heroImage } from '../config/setting'

const Hoc = Component => {
  return class WrapComponent extends React.Component {

    static async getInitialProps (ctx) {
      const initialPageProps = await Component.getInitialProps(ctx)
      return {
        ...initialPageProps
      }
    }

    render() {
      return (
        <Container>
          <Main>
            <Hero img={heroImage} />
            <Component {...this.props} />
          </Main>
        </Container>
      )
    }
  }
}

export default Hoc(PostList)