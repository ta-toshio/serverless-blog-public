import React, { useState, useEffect, useRef } from 'react'
import { Clear } from './Icon'

const ImageWithLoader = ({
  src,
  onLoad,
  onDelete,
  imageClassName,
  showLoading = true,
  overwriteLoading,
}) => {
  const [ loading, setLoading ] = useState(src ? true : false)
  const image = useRef()

  useEffect(() => {
    setLoading(overwriteLoading)
  }, [ overwriteLoading ])

  useEffect(() => {
    if (src && !loading) {
      setLoading(true)
    }
  }, [ src ])

  useEffect(() => {
    if (image && image.current && image.current.complete) {
      setLoading(false)
      onLoad && onLoad()
    }
  }, [])

  return (
    <div className={`image-tool ${loading ? 'image-tool--loading' : ''}`}>
      <div className="image-tool__image">
        {showLoading && loading && (
          <div
            className="image-tool__image-preloader"
            style={{ ...(src 
              ? {
                backgroundImage: `url(${src})`
              } : {}
            )}}
          />
        )}
        {!loading && src && (
          <div className="pitcture-wrapper">
            <img
              className={`image-tool__image-picture ${imageClassName}`}
              src={src}
            />
            <button
              className="btn is-plain is-circle delete"
              onClick={e => {onDelete && onDelete()}}
            >
              <Clear width={24} height={24} />
            </button>
          </div>
        )}
        {src && <img
          ref={image}
          src={src}
          style={{ height: '1px', width: '1px', position: 'absolute', zIndex: -1 }}
          onLoad={() => {
            setLoading(false)
            onLoad && onLoad()
          }}
        />}
      </div>
      <style jsx>{`
        .pitcture-wrapper {
          position: relative;
        }
        .delete {
          position: absolute;
          right: 16px;
          top: 16px;
        }
      `}</style>
    </div>
  )
}

export default ImageWithLoader