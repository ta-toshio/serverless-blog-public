
export default ({
  value,
  options,
  buttonLabel,
  onChange,
  onSearch,
}) => (
  <div className="field is-bar">
    <div className="select">
      <select
        value={value}
        onChange={onChange}
      >
        {options.map((option, i) => (
          <option
            key={`search-${i}`}
            value={option.value}
          >{option.label}</option>
        ))}
      </select>
    </div>
    <button
      onClick={onSearch}
      className="btn is-plain is-primary"
    >
      {buttonLabel}
    </button>
  </div>
)