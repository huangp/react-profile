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
      'cal__day': true,
      // Add this for days that are in the future
      // 'is-disabled': true,
      'is-active': this.props.date === this.props.selectedDay,
    };

    ContentStates.forEach(function(option, index) {
      rowClass[ContentStateStyles[index]] = selectedContentState === option;
    });

    return (
      <td className={cx(rowClass)} onClick={this.handleDayClick}>
        <div className="cal__date">{this.props.dateLabel}</div>
        <div className="cal__date-info" title="{this.props.wordCount} words">{this.props.wordCount}</div>
      </td>
    );
  }
});

export default DayMatrix;
