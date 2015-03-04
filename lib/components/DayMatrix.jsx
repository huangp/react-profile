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
      rowClass;

    rowClass = cx(
      {
        'pill': true,
        'pill--secondary': true,
        'is-active': this.props.date === this.props.selectedDay
      }
    );

    return (
      <li onClick={this.handleDayClick}>
        <div className={rowClass}>
          <div className="g g--collapsed">
            <div className='g__item w--1-2 w--1-2-s txt--align-left'>
              {this.props.dateLabel}
            </div>
            <div className='g__item w--1-2 w--1-2-s txt--align-right txt--nowrap' >{this.props.wordCount} <span className='txt--understated'>words</span></div>
          </div>
        </div>
      </li>
    );
  }
});

export default DayMatrix;
