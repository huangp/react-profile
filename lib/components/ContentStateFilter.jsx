import React from 'react';

var ContentStateFilter = React.createClass({
  onFilterOptionClicked: function(option, event) {
    if (this.props.selectedContentState !== option) {
      this.props.onContentStateSelection(option);
    }
  },
  render: function() {
    var contentStateFilter= this,
      selected = this.props.selectedContentState,
      clickHandler = this.onFilterOptionClicked,
      optionItems;

    optionItems = this.props.contentStateOptions.map(function(optionAndStyle) {
      var option = optionAndStyle[0],
          optionStyle = optionAndStyle[1],
          buttonStyle = 'pill pill--inline '
          buttonStyle += selected === option ? optionStyle + ' is-active' : optionStyle;

      return (
        <span key={option} onClick={ clickHandler.bind(contentStateFilter, option) } className={buttonStyle}>
          {option}
        </span>
      );

    });
    return (
      <div className='l--pad-bottom-half'>{optionItems}</div>
    );
  }
});

export default ContentStateFilter;
