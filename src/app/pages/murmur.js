import React from 'react'
import Container from '../components/atoms/Container'
import Main from '../components/atoms/Main'
import StatusForm from '../modules/murmur/Form'
import StatusList from '../modules/murmur/List'

const Hoc = Component => {
  return class WrapComponent extends React.Component {

    state = { refresh: 0 }

    static async getInitialProps (ctx) {
      const initialPageProps = await Component.getInitialProps(ctx)
      return {
        ...initialPageProps
      }
    }

    handleRefresh = () => {
      this.setState({ refresh: this.state.refresh + 1 })
    }

    render() {
      return (
        <Container>
          <Main>
            <div className="form">
              <StatusForm onSaveStatus={this.handleRefresh} />
            </div>
            <Component
              {...this.props}
              refresh={this.state.refresh}
              handleRefresh={this.handleRefresh}
            />
          </Main>
          <style jsx>{`
            .form {
              margin-bottom: 4em;
            }
          `}</style>
        </Container>
      )
    }
  }
}

export default Hoc(StatusList)