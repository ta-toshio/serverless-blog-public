const Checklist = ({ items }) => {
  const texts = items && items.map((item, i) => {
    return item.text
  }) || []
  return texts.join(' ')
}

export default Checklist