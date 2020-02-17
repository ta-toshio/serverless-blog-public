import { Component } from 'react'

class DropdownMenu extends Component {
  constructor(props){
    super(props)

    this.state = {
      displayMenu: false,
    }

    this.showDropdownMenu = this.showDropdownMenu.bind(this)
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropdownMenu)
  }

  showDropdownMenu(event) {
    event.preventDefault()
    this.setState({ displayMenu: true }, () => {
      document.addEventListener('click', this.hideDropdownMenu)
    })
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu)
    })
  }

  render() {
    const { label, items, mark } = this.props

    return (
      <div className="dropdown">
        <div
          className={`btn ${mark ? "dropdown-button": ""}`}
          onClick={this.showDropdownMenu}
        >
          {label}
        </div>
        {this.state.displayMenu ? (
          <ul>
            {items && items.map((item, i) => (
              <li
                key={`dropdownmenu-${i}`}
                className="dropdownmenu-item"
                {...(item.props ? item.props : {})}
              >
                {item.label}
              </li>
            ))}
          </ul>
        )
        : null}
        <style jsx>{`
          .dropdown {
            position: relative;
            display: inline-block;
            color: buttontext;
          }
          .dropdown-button:before{
            content: "";
            position: absolute;
            width: 0px;
            height: 0px;
            border: 7px solid;
            border-color: #808080 transparent transparent transparent;
            right: -7px;
            top: 18px;
          }
          ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            top: 45px;
            right: -7px;
            min-width: 180px;
            background-color: #fff;
            border: 1px solid rgba(0,0,0,.05);
            position: absolute;
            z-index: 1;
          }
          li {
            cursor: pointer;
            padding: .5em 1em;
            line-height: 1.5;
            border-bottom: 1px solid rgba(0,0,0,.05);
          }
          li:last-child {
            border-bottom: none;
          }
          li:hover {
            background-color: rgba(0,0,0,.05);
          }
          :global(.dropdownmenu-item a),
          :global(.dropdownmenu-item span) {
            display: inline-block;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default DropdownMenu