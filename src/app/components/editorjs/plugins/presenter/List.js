const List = ({ style, items }) => {
  const ListTag = (style === 'unordered') ? 'ul' : 'ol'
  return (
    <div className="editor-js-block">
      <ListTag>
        {items && items.map((item, i) => (
          <li
            key={`list-${i}`}
            className="list-item"
          >{item}</li>
        ))}
      </ListTag>
    </div>
  )
}

export default List