import React from 'react'

const Hoc = Component => {
  return class WrapComponent extends React.Component {
    
    static async getInitialProps (ctx) {
      const initialPageProps = Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}
      return {
        ...initialPageProps
      }
    }

    render() {
      return (
        <div>
          <Component {...this.props} />
          <span>clear</span>
        </div>
      )
    }
  }
}

export default Hoc