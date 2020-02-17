const Checklist = ({ items }) => {
  return (
    <div className="editor-js-block">
      <div className="editor-js-checklist">
      {items && items.map((item, i) => (
        <div
          key={`checklist-${i}`}
          className={`checklist-item ${item.checked ? `checkbox-item-checked` : ``}`}
        >
          <span className="checklist-checkbox"></span>
          <div className="checkbox-text">
            {item.text}
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}

export default Checklist