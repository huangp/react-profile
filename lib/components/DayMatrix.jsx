import React from 'react';

var DayMatrix = React.createClass({
  handleDayClick: function(event) {
    var dayChosen = this.props.date;
    if (this.props.selectedDay == dayChosen) {
      // click the same day again will cancel selection
      this.props.onDaySelection(null);
    } else {
      this.props.onDaySelection(dayChosen);
    }
  },
  render: function() {
    var buttonClass = 'button--link';
    buttonClass += this.props.date === this.props.selectedDay ? ' is-active' : '';
    return (
      <tr>
        <td className='l--pad-left-0 l--pad-v-0 w--1'>
          <button className={buttonClass} onClick={this.handleDayClick}>{this.props.dateLabel}</button>
        </td>
        <td className='txt--align-right l--pad-right-0 l--pad-v-0 txt--nowrap' >{this.props.wordCount} <span className='txt--understated'>words</span></td>
      </tr>
    );
  }
});

export default DayMatrix;
