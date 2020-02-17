import React, { useState, useEffect } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { searchTag } from '../../domains/models/tag'

const fetchTags = async inputValue => {
  try {
    return await searchTag(inputValue)    
  } catch (e) {}
}

const InputTag = ({ onChange, defaultValue }) => {
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted && (
        <AsyncCreatableSelect
          cacheOptions
          isMulti
          defaultOptions
          loadOptions={fetchTags}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      )}
    </>
  )
}

export default InputTag