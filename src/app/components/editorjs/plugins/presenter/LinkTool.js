const LinkTool = ({ link, meta }) => (
  <div className="editor-js-block">
    <div className="editor-js-link-tool">
      <a
        href={link}
        className="editor-js-link-tool-content editor-js-link-tool-content-rendered"
        target="_blank"
        rel="noreferrer noopener"
      >
        {meta.image && meta.image.url && (
          <div
            className="editor-js-link-tool-image"
            style={{
              backgroundImage: `url('${meta.image.url}')`
            }}
          />
        )}
        <h4 className="editor-js-link-tool-title">{meta.title}</h4>
        <p className="editor-js-link-tool-description">{meta.description}</p>
        <p>
          <span className="editor-js-link-tool-anchor">{link}</span>
        </p>
      </a>
    </div>
  </div>
)

export default LinkTool