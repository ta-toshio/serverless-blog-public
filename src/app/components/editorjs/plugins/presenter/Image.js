const Image = ({
  file,
  caption,
  ...others
}) => {

  const classes = []
  for (let [key, value] of Object.entries(others)) {
    if (value === true) {
      classes.push(key)
    }
  }

  return (
    <div className="editor-js-block">
      <div className={`editor-js-image-wrap ${classes.join(' ')}`}>
        <div className="editor-js-image">
          <img className="editor-js-image-picture" src={`${file.url}`} />
          {caption && (<div>{caption}</div>)}
        </div>
      </div>
    </div>
  )
}

export default Image