import { Component } from 'react'
import Router from 'next/router'
import editorjs from '../../../domains/services/editor'
import {
  STATUS_PUBLIC,
  getPage,
  updatePage,
  deletePage,
} from '../../../domains/models/page'
import ValidationError from '../../../domains/errors/validationError'
import { redirect } from '../../../domains/miscs/redirect'
import { LoadingContext } from '../../../components/contexts/Loading'
import LoggedInUserProvider from '../../../components/hoc/LoggedInUserProvider'
import Main from '../../../components/atoms/Main'
import Container from '../../../components/atoms/Container'
import Article from '../../../components/atoms/Article'

class Edit extends Component {

  static contextType = LoadingContext

  constructor(props) {
    super(props)

    this.state = {
      editor: null,
      status: STATUS_PUBLIC,
      errors: null,
      messages: null,
    }
    this.inputTitle = React.createRef()
    this.inputSlug = React.createRef()
  }

  static async getInitialProps({ res, query }) {
    const { id } = query
    const page = await getPage(id)
    if (!page) {
      redirect('/', res)
    }
    return { id: page.id, page }
  }

  componentDidMount() {
    const { page } = this.props
    const { user } = this.props.user
    if (!user) {
      return Router.replace('/')
    }

    const body = page ? JSON.parse(page.draft.body) : null
    const editor = editorjs(body)
    this.setState({
      editor,
      status: page.status,
    })

    this.inputTitle.current.value = page ? page.draft.title : null
    this.inputSlug.current.value = page ? page.draft.slug : null
  }

  handleSave = () => {
    const { editor } = this.state
    const { id } = this.props
    const { setIsLoading } = this.context

    this.setState({ errors: null, messages: null })
    editor.save()
      .then(outputData => {
        return this.save(id, outputData)
      })
      .then(data => {
        setIsLoading(false)
        this.setState({ messages: ['Page updated'] })
      })
      .catch((e) => {
        setIsLoading(false)
        if (e instanceof ValidationError) {
          this.setState({ errors: e.errors })
        }
      })
  }

  save = async (id, body) => {
    const { setIsLoading } = this.context
    const { user } = this.props.user
    const { status } = this.state

    setIsLoading(true)

    await updatePage({
      id,
      status,
      title: this.inputTitle.current.value,
      slug: this.inputSlug.current.value,
      body: JSON.stringify(body),
      userId: user.uid,
    })
    return true
  }

  handleDelete = e => {
    const { id } = this.props
    const { setIsLoading } = this.context

    setIsLoading(true)
    this.setState({ errors: null, messages: null })
    deletePage(id)
      .then(() => {
        setIsLoading(false)
        Router.push('/')
      })
      .catch(e => {
        console.log(e)
        if (e instanceof ValidationError) {
          this.setState({ errors: e.errors })
        }
        setIsLoading(false)
      })
  }

  render() {
    const { status, errors, messages, image, tags } = this.state

    return (
      <Container>
        <Main>
          <Article className="group is-space">
            <div className="field">
              <input
                id="input-title"
                type="text"
                className="input editor-input is-mobile-0"
                placeholder="title"
                ref={this.inputTitle}
              />
            </div>
            <div className="field">
              <input
                id="input-slug"
                type="text"
                className="input editor-input is-mobile-0"
                placeholder="slug url"
                ref={this.inputSlug}
              />
            </div>
            <div id="editor" className="editor" />

            {errors && errors.map(error => (
              <div className="alert is-warning" key={`error-${error.key}`}>
                <span className="text">{error.message}</span>
              </div>
            ))}
            {messages && messages.map((message, i) => (
              <div className="alert is-success" key={`message-${i}`}>
                <span className="text">{message}</span>
              </div>
            ))}
            <div className="actions btns is-between">
              <div className="field is-bar">
                <div className="select">
                  <select
                    value={status}
                    onChange={e => this.setState({ status: e.target.value })}
                  >
                    <option value={0}>private</option>
                    <option value={1}>public</option>
                    <option value={2}>draft</option>
                  </select>
                </div>
                <button
                  onClick={this.handleSave}
                  className="btn is-plain is-primary"
                >save
                </button>
              </div>
              <button
                className="btn"
                onClick={this.handleDelete}
              >Delete</button>
            </div>
          </Article>
        </Main>
      </Container>
    )
  }

}

export default LoggedInUserProvider(Edit)