import React, { Component } from 'react'
import Factory from './TextFactory'
import sanitizeHtml from 'sanitize-html'

class TextRender extends Component {

  render() {
    const { blocks, truncate = 200 } = this.props

    let items
    try {
      items = JSON.parse(blocks)
    } catch (e) {
      return null
    }

    const dirtyText = items && items.blocks && items.blocks.map((block, i) => {
      return Factory.create(block)
    })
    .filter(text => text)
    .join(' ')

    const cleanText = sanitizeHtml(dirtyText, {
      allowedTags: [],
      allowedAttributes: {}
    })

    const text = typeof cleanText === 'string'
      ? (cleanText.length > truncate
        ? cleanText.substr(0, truncate) + "..."
        : cleanText)
      : ''

    return text
      ? <div dangerouslySetInnerHTML={{ __html: text }} />
      : <></>
  }
}

export default TextRender