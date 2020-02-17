const List = ({ style, items }) => {
  const texts = items && items.map((item, i) => {
    return item
  }) || []
  return texts.join(' ')
}

export default List