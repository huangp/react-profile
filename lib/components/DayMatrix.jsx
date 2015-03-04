import React from 'react/addons';

var DayMatrix = React.createClass({
  propTypes: {
    dateLabel: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired,
    wordCount: React.PropTypes.number.isRequired,
    onDaySelection: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      showWords: true
    }
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
      wordsDesc = '',
      selectedContentState = this.props.selectedContentState,
      rowClass;

    rowClass = {
      'pill': true,
      'is-active': this.props.date === this.props.selectedDay
    };
    this.props.contentStateOptions.forEach(function(optionAndStyle) {
      rowClass[optionAndStyle[1]] = selectedContentState === optionAndStyle[0];
    });

    // TODO this is dodgy. Should use responsive design to show/hide this portion
    if (this.props.showWords) {
      wordsDesc = ' words';
    }

    return (
      <div className={cx(rowClass)} onClick={this.handleDayClick}>
        <div className="g g--collapsed">
          <div className='g__item w--1-2 w--1-2-s txt--align-left txt--align-left-s'>
            {this.props.dateLabel}
          </div>
          <div className='g__item w--1-2 w--1-2-s txt--align-right txt--align-right-s txt--nowrap' >{this.props.wordCount} <span className='txt--understated'>{wordsDesc}</span></div>
        </div>
      </div>
    );
  }
});

export default DayMatrix;
