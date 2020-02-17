const Table = ({ content }) => {
  const texts = content && content.map((row, i) => {
    const cols = row && row.map(col => col)
    return cols.join(' ')
  }) || []
  return texts.join(' ')
}

export default Table