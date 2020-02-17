const Embed = ({
  service,
  source,
  embed,
  width,
  height,
  caption
}) => {
  return (
    <div className="editor-js-block editor-js-embed">
      <iframe
        src={embed}
        style={{width:'100%', height:`${height}px`}}
        scrolling="no"
        frameBorder="no"
      />
      {caption && (
        <footer className="editor-js-embed-caption">
          {caption}
        </footer>
      )}
    </div>
  )
}

export default Embed