const Table = ({ content }) => {
  return (
    <div className="editor-js-block">
      <table className="editor-js-table">
        <tbody>
        {content && content.map((row, i) => (
          <tr key={`row-${i}`}>
            {row && row.map((col, j) => (
              <td key={`col-${j}`}>{col}</td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table