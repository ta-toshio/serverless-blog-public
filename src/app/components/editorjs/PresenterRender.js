import React, { Component } from 'react'
import Factory from './PresenterFactory'

class Render extends Component {

  render() {
    const { blocks } = this.props

    let items
    try {
      items = JSON.parse(blocks)
    } catch (e) {
      return null
    }

    return (
      <>
        {items && items.blocks && items.blocks.map((block, i) => (
          <React.Fragment key={`block-${items.time}-${i}`}>
            {Factory.create(block)}
          </React.Fragment>
        ))}
      </>
    )
  }
}

export default Render