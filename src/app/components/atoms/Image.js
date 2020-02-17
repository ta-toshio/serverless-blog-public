import React, { useState, useEffect, useRef } from 'react'

const Image = ({ src, ...others }) => {
  const image = useRef()
  const [ loading, setLoading ] = useState(src ? true : false)

  useEffect(() => {
    if (src && !loading) {
      setLoading(true)
    }
  }, [ src ])

  useEffect(() => {
    if (image && image.current && image.current.complete) {
      setLoading(false)
    }
  }, [])

  const className = ['wrapper']
  if (loading) {
    className.push('loading')
  } else {
    className.push('loaded')
  }

  return (
    <>
      {src && 
        <div className={className.join(' ')}>
          <img src={src} {...others} />
          {loading && (
            <img
              ref={image}
              src={src}
              className="catcher"
              onLoad={() => setLoading(false)}
            />
          )}
        </div>
      }
      <style jsx>{`
        .wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .wrapper::after {
          content: "";
          position: absolute;
          left: 0px;
          top: 0px;
          right: 0px;
          bottom: 0px;
          z-index: 1;
          background: #fff;
          transition: opacity 0.3s ease-out 0s;
        }
        .loading::after {
          opacity: 1;
        }
        .loaded::after {
          opacity: 0;
        }
        .catcher {
          height: 1px;
          width: 1px;
          position: absolute;
          z-index: -1;
        }
      `}</style>
    </>
  )
}

export default Image