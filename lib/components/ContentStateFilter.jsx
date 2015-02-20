import React from 'react';

var ContentStateFilter = React.createClass({
  onFilterOptionClicked: function(event) {
    var optionInnerText = event.target.innerText;
    if (this.props.selectedContentState !== optionInnerText) {
      this.props.onContentStateSelection(optionInnerText);
    }
  },
  render: function() {
    var optionItems = [],
      selected = this.props.selectedContentState,
      clickHandler = this.onFilterOptionClicked;

    optionItems = this.props.contentStateOptions.map(function(optionAndStyle) {
      var option = optionAndStyle[0],
          optionStyle = optionAndStyle[1],
          buttonStyle = selected === option ? 'is-active' : optionStyle;

      return (
        <button key={option} onClick={clickHandler} className={buttonStyle + ' button--link l--pad-h-quarter txt--align-center'}>
          {option}
        </button>
      );

    });
    return (
      <div>{optionItems}</div>
    );
  }
});

export default ContentStateFilter;
