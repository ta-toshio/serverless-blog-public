import React, { useState, useEffect, useContext, useRef } from 'react'
import Router from 'next/router'
import { LoadingContext } from '../../components/contexts/Loading'
import Container from '../../components/atoms/Container'
import Main from '../../components/atoms/Main'
import {
  updateUserPhoto,
  deleteUserPhoto,
  updateUser,
  updateServerUserSessionData,
} from '../../domains/models/user'
import LoggedInUserProvider from '../../components/hoc/LoggedInUserProvider'
import { redirect } from '../../domains/miscs/redirect'

const update = async ({
  uid,
  name,
  file,
  isPhotoDelete
}) => {
  try {
    const photoUrl = await updateUserPhoto({ uid, file })
    const data = { uid, name }

    photoUrl && (data.photoUrl = photoUrl)
    if (isPhotoDelete) {
      data.photoUrl = null
      deleteUserPhoto(uid)
    }
    const result = await updateUser(data)
    await updateServerUserSessionData()
    return { result, data }
  } catch(e) {throw e}
}

const Setting = (props) => {
  const { user, setUser } = props.user
  const { setIsLoading } = useContext(LoadingContext)
  const [ file, setFile ] = useState(null)
  const [ isPhotoDelete, setIsPhotoDelete ] = useState(false)

  // @TODO replace with formik
  const nameEl = useRef(null)
  const fileEl = useRef(null)
  const photoDeleteEl = useRef(null)

  useEffect(() => {
    !user && Router.replace('/')
  }, [])

  useEffect(() => {
    if (user) {
      nameEl.current.value = user.name
    }
  }, [])

  return (
    <Container>
      <Main>
        <div className="form is-space">
          <p className="heading">User Name</p>
          <div className="field">
            <input
              ref={nameEl}
              className="input is-mobile-full is-tablet-4"
              type="text"
            />
          </div>
          <div className="field file-field">
            <label className="btn is-plain">
              <span className="text">ファイル選択</span>
              <input
                ref={fileEl}
                type="file"
                className="input"
                accept=".jpg,.jpeg,.png"
                onChange={e => {
                  if (fileEl.current.files.length > 0) {
                    setFile(fileEl.current.files[0])
                  } else {
                    setFile(null)
                  }
                }}
              />
            </label>
            <span className="filename">{file && file.name}</span>
          </div>
          {user && user.photoUrl && (
            <div className="field">
              <img
                src={user.photoUrl}
                className="photo"
              />
              <label className="label is-checkbox">
                <input
                  ref={photoDeleteEl}
                  type="checkbox"
                  value={1}
                  className="input"
                  onChange={e => {
                    setIsPhotoDelete(!isPhotoDelete)
                  }}
                />
                <span className="text is-middle">Delete</span>
              </label>
            </div>
          )}
          <div className="btns">
            <button
              className="btn is-plain is-success is-mobile-full is-tablet-4"
              onClick={e => {
                setIsLoading(true)
                update({
                  setUser,
                  setFile,
                  uid: user.uid,
                  name: nameEl.current.value,
                  file,
                  isPhotoDelete,
                })
                  .then(({ result, data }) => {
                    setUser(data)
                    setFile(null)
                    setIsPhotoDelete(false)
                  })
                  .catch(e => {
                    console.log(e)
                  })
                  .finally(() => {
                    setIsLoading(false)
                  })
                }
              }
            >
              Submit
            </button>
          </div>
        </div>
      </Main>
      <style jsx>{`
        .file-field {
          display: flex;
          align-items: center;
        }
        .photo {
          max-width: 200px;
        }
        .filename {
          margin-left: 16px;
        }
      `}</style>
    </Container>
  )
}

Setting.getInitialProps = ({ req, res }) => {
  if (req && !req.session.user) {
    redirect('/', res)
  }
  return {}
}

export default LoggedInUserProvider(Setting)