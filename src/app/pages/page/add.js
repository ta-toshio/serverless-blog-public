import { Component } from 'react'
import Router from 'next/router'
import editorjs from '../../domains/services/editor'
import {
  STATUS_PUBLIC,
  createPage,
} from '../../domains/models/page'
import ValidationError from '../../domains/errors/validationError'
import { LoadingContext } from '../../components/contexts/Loading'
import LoggedInUserProvider from '../../components/hoc/LoggedInUserProvider'
import Main from '../../components/atoms/Main'
import Container from '../../components/atoms/Container'
import Article from '../../components/atoms/Article'

class Add extends Component {

  static contextType = LoadingContext

  constructor(props) {
    super(props)

    this.state = {
      editor: null,
      status: STATUS_PUBLIC,
      errors: null,
    }
    this.inputTitle = React.createRef()
    this.inputSlug = React.createRef()
  }

  componentDidMount() {
    // @TODO move getInitialProps with using redux
    const { user } = this.props.user
    if (!user) {
      return Router.replace('/')
    }

    const editor = editorjs()

    this.setState({ editor })
  }

  handleSave = () => {
    const { editor } = this.state
    const { setIsLoading } = this.context

    this.setState({ errors: null })
    editor.save().then((outputData) => {
      return this.save(outputData)
    })
    .then(() => {
      setIsLoading(false)
      Router.push('/page/list')
    })
    .catch((e) => {
      setIsLoading(false)
      if (e instanceof ValidationError) {
        this.setState({ errors: e.errors })
      }
    })
  }

  save = async body => {
    const { setIsLoading } = this.context
    const { user } = this.props.user
    const { status } = this.state

    setIsLoading(true)

    await createPage({
      status,
      title: this.inputTitle.current.value,
      slug: this.inputSlug.current.value,
      body: JSON.stringify(body),
      userId: user.uid,
    })
    return true
  }

  render() {
    const { status, errors } = this.state

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

            {errors && errors.map((error, i) => (
              <div className="alert is-warning" key={`error-${error.key}`}>
                <span className="text">{error.message}</span>
              </div>
            ))}
            <div className="actions btns">
              <div className="field is-bar">
                <div className="select">
                  <select
                    value={status}
                    onChange={e => this.setState({ status: e.target.value })}
                  >
                    <option value={0}>private</option>
                    <option value={1}>public</option>
                  </select>
                </div>
                <button
                  onClick={this.handleSave}
                  className="btn is-plain is-primary"
                >save
                </button>
              </div>
            </div>
          </Article>
        </Main>
      </Container>
    )
  }

}

export default LoggedInUserProvider(Add)

