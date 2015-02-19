import React from 'react';

var DayMatrix = React.createClass({
  handleDayClick: function(event) {
    var dayChosen = event.target.innerText;
    if (this.props.selectedDay == dayChosen) {
      // click the same day again will cancel selection
      this.props.onDaySelection(null);
    } else {
      this.props.onDaySelection(dayChosen);
    }
  },
  render: function() {
    return (
      <div className='g l--pad-v-quarter'>
        <span className='w--3-4 g__item l--pad-h-half' onClick={this.handleDayClick}>{this.props.date}</span>
        <span className='w--1-4 g__item l--pad-h-half txt--align-right' >{this.props.wordCount} <span className='txt--neutral'>words</span></span>
      </div>
    );
  }
});

export default DayMatrix;
