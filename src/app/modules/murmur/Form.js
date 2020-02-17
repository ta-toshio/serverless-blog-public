import React, { useState, useEffect, useContext } from 'react'
import { LoadingContext } from '../../components/contexts/Loading'
import AuthContext from '../../components/contexts/auth'
import editorjs from '../../domains/services/editor'
import { createStatus } from '../../domains/models/status'

const Form = ({ onSaveStatus }) => {
  const { setIsLoading } = useContext(LoadingContext)
  const { user } = useContext(AuthContext)
  const [ editor, setEditor ] = useState(null)

  useEffect(() => {
    // user && setEditor(editorjs({}, { maxNumOfBlocks: 1 }))
    user && setEditor(editorjs())
  }, [])

  return (
    <>
      {user && (
        <>
          <div id="editor" />

          <div className="actions btns is-right">
            <div className="field">
              <button
                onClick={e => {
                  setIsLoading(true)
                  editor.save().then(data => {
                    if (!data || (data.blocks && data.blocks.length === 0)) {
                      return false
                    }
                    return createStatus({
                      body: JSON.stringify(data),
                      userId: user && user.uid
                    })
                  })
                  .then(() => {
                    editor.blocks.clear()
                    setIsLoading(false)
                    onSaveStatus()
                  })
                  .catch((e) => {
                    setIsLoading(false)
                  })
                }}
                className="btn is-plain is-primary"
              >save
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Form