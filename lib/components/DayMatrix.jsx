import React from 'react/addons';

var DayMatrix = React.createClass({
  propTypes: {
    dateLabel: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired,
    wordCount: React.PropTypes.number.isRequired,
    onDaySelection: React.PropTypes.func.isRequired
  },

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
    var cx = React.addons.classSet,
      buttonClass;

    buttonClass = cx(
      {
        'button--link': true,
        'is-active': this.props.date === this.props.selectedDay
      }
    );

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
