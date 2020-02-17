import { Component } from 'react'
import Router from 'next/router'
import editorjs from '../../../domains/services/editor'
import {
  STATUS_PUBLIC,
  getPost,
  updatePost,
  deletePost,
  uploadFeaturedImage,
  deleteFeaturedImage,
} from '../../../domains/models/post'
import ValidationError from '../../../domains/errors/validationError'
import { redirect } from '../../../domains/miscs/redirect'
import get from '../../../domains/miscs/get'
import { LoadingContext } from '../../../components/contexts/Loading'
import LoggedInUserProvider from '../../../components/hoc/LoggedInUserProvider'
import Main from '../../../components/atoms/Main'
import Container from '../../../components/atoms/Container'
import Article from '../../../components/atoms/Article'
import InputTag from '../../../components/atoms/InputTag'
import ImageRegister from '../../../components/molecules/ImageRegister'

class Edit extends Component {

  static contextType = LoadingContext

  constructor(props) {
    super(props)

    const tags = get(['post', 'draft', 'tags'], props)
    this.state = {
      editor: null,
      status: STATUS_PUBLIC,
      errors: null,
      messages: null,
      image: get(['post', 'draft', 'image'], props) || null,
      tags: tags && tags.map(tag => ({ label: tag, value: tag })) || []
    }
    this.inputTitle = React.createRef()
    this.inputSlug = React.createRef()
  }

  static async getInitialProps({ res, query }) {
    const { id } = query
    const post = await getPost(id)
    if (!post) {
      redirect('/', res)
    }
    return { id: post.id, post }
  }

  componentDidMount() {
    const { post } = this.props
    const { user } = this.props.user
    if (!user) {
      return Router.replace('/')
    }

    const body = post ? JSON.parse(post.draft.body) : null
    const editor = editorjs(body)
    this.setState({
      editor,
      status: post.status,
      image: post.image,
    })

    this.inputTitle.current.value = post ? post.draft.title : null
    this.inputSlug.current.value = post ? post.draft.slug : null
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
        this.setState({ messages: ['Post updated'] })
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
    const { status, image, tags } = this.state

    setIsLoading(true)

    await updatePost({
      id,
      status,
      title: this.inputTitle.current.value,
      slug: this.inputSlug.current.value,
      body: JSON.stringify(body),
      userId: user.uid,
      image,
      tags,
    })
    return true
  }

  setTags = tags => {
    this.setState({ tags })
  }

  handleDelete = e => {
    const { id } = this.props
    const { setIsLoading } = this.context

    setIsLoading(true)
    this.setState({ errors: null, messages: null })
    deletePost(id)
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
            <ImageRegister
              upload={uploadFeaturedImage}
              remove={deleteFeaturedImage}
              url={image && image.url}
              path={image && image.path}
              update={data => {
                this.setState({
                  image: data ? { url: data.url, path: data.path } : null
                })
              }}
            />
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

            <InputTag
              onChange={this.setTags}
              defaultValue={tags}
            />

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