import React, { useState, useEffect } from 'react'
import ImageButton from '../atoms/ImageButton'
import ImageWithLoader from '../atoms/ImageWithLoader'

const STATUS = {
  EMPTY: 'empty',
  LOADING: 'loading',
  LOADED: 'loaded'
}

const useUploader = ({
  url: inputUrl,
  path: inputPath,
  upload,
  remove,
  update,
}) => {
  const [ url, setUrl ] = useState(inputUrl)
  const [ path, setPath ] = useState(inputPath)
  const [ status, setStatus ] = useState(inputUrl ? STATUS.LOADING : STATUS.EMPTY )

  const doUpload = async file => {
    try {
      const { url, path } = await upload({ file, path })
      setUrl(url)
      setPath(path)
      update({ url, path })
    } catch (e) {}
  }

  const doRemove = async () => {
    try {
      await remove(path)
      setUrl(null)
      setPath(null)
      update(null)
      reset()
    } catch (e) {
      console.log(e)
    }
  }

  const reset = () => {
    setStatus(STATUS.EMPTY)
  }

  const loading = () => {
    setStatus(STATUS.LOADING)
  }

  const loaded = () => {
    setStatus(STATUS.LOADED)
  }

  return {
    status,
    reset,
    loading,
    loaded,
    url,
    doUpload,
    doRemove,
  }
}

const ImageRegister = ({
  url: inputUrl,
  path: inputPath,
  upload,
  remove,
  update,
}) => {

  const {
    status,
    loading,
    loaded,
    url,
    path,
    doUpload,
    doRemove,
  } = useUploader({
    url: inputUrl,
    path: inputPath,
    upload,
    remove,
    update,
  })

  return (
    <>
      {status === STATUS.EMPTY && (
        <ImageButton
          onSelectFile={(e, { files }) => {
            loading()
            if (files && files.length > 0) {
              doUpload(files[0])
            }
          }}
        />
      )}
      {(status === STATUS.LOADING || status === STATUS.LOADED) && (
        <ImageWithLoader
          src={url}
          onLoad={loaded}
          onDelete={doRemove}
          imageClassName="featured-image"
          overwriteLoading={status === STATUS.LOADING}
        />
      )}
    </>
  )
}

export default ImageRegister