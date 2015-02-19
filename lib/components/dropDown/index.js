import React from 'react';

var DropDown = React.createClass({
  onOptionClicked: function(event) {
    var clickedOption = event.target.innerText;
    if (this.props.selectedOption != clickedOption) {
      this.props.onOptionSelection(clickedOption);
    }
  },

  render: function() {
    var options = this.props.options,
      selected = this.props.selectedOption,
      handler = this.onOptionClicked,
      optionList;

    optionList = options.map(function (option) {
      var className = option === selected ? 'is-active' : '';
      return <li key={option}>
        <a className={className} href="#" onClick={handler}>{option}</a>
      </li>
    });

    return (
      <span className="dropdown dropdown--inline js-dropdown">
        <a className="dropdown__toggle js-dropdown__toggle" href="#">{selected}</a>
        <ul className="dropdown__content js-dropdown__content">
          {optionList}
        </ul>
      </span>
    )
  }
});

export default DropDown;
