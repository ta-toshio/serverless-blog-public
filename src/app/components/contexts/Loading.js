import React, { createContext } from 'react'
import { CircleLoading as LoadingIcon } from '../atoms/Loading'

export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {}
})

class Loading extends React.Component {

  constructor(props) {
    super(props)

    this.setIsLoading = isLoading => {
      this.setState({ isLoading })
    }

    this.state = {
      isLoading: false,
      setIsLoading: this.setIsLoading
    }
  }

  render() {
    const { isLoading } = this.state
    return (
      <LoadingContext.Provider value={this.state}>
        {this.props.children}
        {isLoading && (
          <div className="loading-page-mask">
            <LoadingIcon color="black" />
          </div>
        )}
      </LoadingContext.Provider>
    )
  }

}

export default Loading