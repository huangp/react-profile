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

    this.props.contentStateOptions.forEach(function(optionAndStyle) {
      var option = optionAndStyle[0],
        optionStyle = optionAndStyle[1];

      var buttonStyle = selected === option ? 'badge--highlight' : optionStyle;
      optionItems.push(<span key={option} onClick={clickHandler} className={buttonStyle + ' l--pad-h-quarter txt--align-center w--1-4 g__item'}>
                         {option}
                       </span>);
    });
    return (
      <div className='g'>{optionItems}</div>
    );
  }
});

export default ContentStateFilter;
