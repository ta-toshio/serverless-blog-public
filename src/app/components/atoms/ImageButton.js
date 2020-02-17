import React, { useState, useEffect, useRef } from 'react'
import { AddPhotoAlternate } from './Icon'

const ImageButton = ({ onSelectFile }) => {
  const file = useRef()

  return (
    <>
      <button
        className="btn is-lg is-plain is-circle"
        onClick={e => {
          file.current.click()
        }}
      >
        <AddPhotoAlternate width={36} height={36} />
      </button>
      <input
        ref={file}
        type="file"
        style={{display: 'none'}}
        onChange={e => {
          onSelectFile && onSelectFile(e, file.current)
        }}
      />
    </>
  )
}

export default ImageButton