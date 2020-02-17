const Quote = ({ text, caption, alignment }) => {
  return (
    <div className="editor-js-block">
      <blockquote className={`editor-js-quote ${alignment === 'center'
        ? 'editor-js-quote-center' : '' }`}>
        {text}
      </blockquote>
      {caption && (<span>{caption}</span>)}
    </div>
  )
}

export default Quote