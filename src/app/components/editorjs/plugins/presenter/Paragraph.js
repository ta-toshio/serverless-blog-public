import sanitizeHtml from 'sanitize-html'

const Paragraph = ({ text }) => (
  <div className="editor-js-block">
    <p dangerouslySetInnerHTML={{
      __html: sanitizeHtml(text, {
        allowedTags: ['i', 'b', 'a', 'code', 'mark', 'br'],
        allowedAttributes: {
          'a': ['href'],
          'code': ['class'],
          'mark': ['class'],
        }
      })
    }} />
  </div>
)

export default Paragraph