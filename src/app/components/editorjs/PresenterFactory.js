import React from 'react'
import Checklist from './plugins/presenter/Checklist'
import Code from './plugins/presenter/Code'
import Delimiter from './plugins/presenter/Delimiter'
import Embed from './plugins/presenter/Embed'
import Header from './plugins/presenter/Header'
import Image from './plugins/presenter/Image'
import List from './plugins/presenter/List'
import LinkTool from './plugins/presenter/LinkTool'
import Paragraph from './plugins/presenter/Paragraph'
import Quote from './plugins/presenter/Quote'
import Table from './plugins/presenter/Table'

class Factory {

  static resolve(block) {
    switch (block.type) {
      case 'code':
        return Code
      case 'checklist':
        return Checklist
      case 'delimiter':
        return Delimiter
      case 'embed':
        return Embed
      case 'header':
        return Header
      case 'image':
        return Image
      case 'list':
        return List
      case 'linkTool':
        return LinkTool
      case 'paragraph':
        return Paragraph
      case 'quote':
        return Quote
      case 'table':
        return Table
      default:
        return null;
    }
  }

  static create(block) {
    const Component = Factory.resolve(block)
    return (Component
      ? <Component {...block.data} />
      : <React.Fragment />)
  }

}

export default Factory