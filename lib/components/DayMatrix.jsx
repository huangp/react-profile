import React from 'react/addons';
import {ContentStates, ContentStateStyles} from '../constants/Options';
import Actions from '../actions/Actions';
import {PureRenderMixin} from 'react/addons';

var DayMatrix = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    dateLabel: React.PropTypes.string.isRequired,
    date: React.PropTypes.string.isRequired,
    wordCount: React.PropTypes.number.isRequired
  },


  handleDayClick: function(event) {
    var dayChosen = this.props.date;
    if (this.props.selectedDay == dayChosen) {
      // click the same day again will cancel selection
      Actions.clearSelectedDay();
    } else {
      Actions.onDaySelected(dayChosen);
    }
  },

  render: function() {
    var cx = React.addons.classSet,
      selectedContentState = this.props.selectedContentState,
      rowClass;

    rowClass = {
      'pill': true,
      'is-active': this.props.date === this.props.selectedDay,
      'txt--neutral' : this.props.wordCount == 0
    };
    ContentStates.forEach(function(option, index) {
      rowClass[ContentStateStyles[index]] = selectedContentState === option;
    });

    return (
      <div className={cx(rowClass)} onClick={this.handleDayClick}>
        <div className="g g--collapsed">
          <div className='g__item txt--align-left txt--align-left-s'>
            {this.props.dateLabel}
          </div>
          <div className='g__item txt--align-right txt--align-right-s txt--nowrap' >{this.props.wordCount}</div>
        </div>
      </div>
    );
  }
});

export default DayMatrix;
