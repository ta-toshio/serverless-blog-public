import nl2br from '../../../miscs/nl2br'
import toWhiteSpace from '../../../miscs/toHtmlSpace'

const Code = ({ code }) => (
  <div className="editor-js-block editor-js-code">
    <pre>
      <code>{nl2br(toWhiteSpace(code))}</code>
    </pre>
  </div>
)

export default Code