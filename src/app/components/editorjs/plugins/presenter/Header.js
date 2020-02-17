const Header = ({ level, text }) => {
  const Tag = `h${level}`
  return (
    <div className="editor-js-block">
      <Tag>{text}</Tag>
    </div>
  )
}

export default Header