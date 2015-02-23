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
      <tr>
        <td onClick={this.handleDayClick} className='l--pad-left-0 l--pad-v-0 w--1'>{this.props.date}</td>
        <td className='txt--align-right l--pad-right-0 l--pad-v-0 txt--nowrap' >{this.props.wordCount} <span className='txt--understated'>words</span></td>
      </tr>
    );
  }
});

export default DayMatrix;
