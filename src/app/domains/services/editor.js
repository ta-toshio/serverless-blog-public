import setting from '../../config/setting'

export default (data = {}, config = {}) => {

  const EditorJS = require('@editorjs/editorjs')
  const Checklist = require('@editorjs/checklist')
  const CodeTool = require('@editorjs/code')
  const Delimiter = require('@editorjs/delimiter')
  const Embed = require('@editorjs/embed')
  const Header = require('@editorjs/header')
  const Image = require('@editorjs/image')
  const InlineCode = require('@editorjs/inline-code')
  const List = require('@editorjs/list')
  const LinkTool = require('@editorjs/link')
  const Marker = require('@editorjs/marker')
  const Quote = require('@editorjs/quote')
  const Table = require('@editorjs/table')

  const defaultConfig = {
    holderId: 'editor', 

    tools: {
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      code: {
        class:  CodeTool,
        shortcut: 'CMD+SHIFT+C'
      },
      delimiter: Delimiter,
      embed: Embed,
      header: {
        class: Header,
        inlineToolbar: ['link'],
        config: {
          placeholder: 'Header'
        },
        shortcut: 'CMD+SHIFT+H'
      },
      image: {
        class: Image,
        config: {
          endpoints: {
            byFile: setting.editorjs.editorImageFileEndPoint,
            byUrl: setting.editorjs.editorImageUrlEndPoint,
          },
        }
      },
      inlineCode: {
        class: InlineCode,
        shortcut: 'CMD+SHIFT+C'
      },
      list: {
        class: List,
        inlineToolbar: true,
        shortcut: 'CMD+SHIFT+L'
      },
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: setting.editorjs.editorLinkEndPoint,
        }
      },
      marker: {
        class:  Marker,
        shortcut: 'CMD+SHIFT+M'
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: 'Enter a quote',
          captionPlaceholder: 'Quote\'s author',
        },
        shortcut: 'CMD+SHIFT+O'
      },
      table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+ALT+T'
      },
    },

    data,

    autofocus: true,

    // initialBlock: 'paragraph',

    onReady: () => {
      console.log('Editor.js is ready to work!')
    }
  }

  const editor = new EditorJS({ ...defaultConfig, ...config })

  return editor
}