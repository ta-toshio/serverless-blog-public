import React from 'react'
import Container from '../../components/atoms/Container'
import Main from '../../components/atoms/Main'
import PageList from '../../modules/page/List'

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
            <Component {...this.props} />
          </Main>
        </Container>
      )
    }
  }
}

export default Hoc(PageList)