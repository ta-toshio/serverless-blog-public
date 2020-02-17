import Checklist from './plugins/text/Checklist'
import Code from './plugins/text/Code'
import Header from './plugins/text/Header'
import List from './plugins/text/List'
import Paragraph from './plugins/text/Paragraph'
import Quote from './plugins/text/Quote'
import Table from './plugins/text/Table'

class TextFactory {

  static resolve(block) {
    switch (block.type) {
      case 'code':
        return Code
      case 'checklist':
        return Checklist
      case 'header':
        return Header
      case 'list':
        return List
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
    const Func = TextFactory.resolve(block)
    return Func ? Func(block.data) : null
  }

}

export default TextFactory