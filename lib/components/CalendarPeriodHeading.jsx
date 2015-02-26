import React from 'react';
import moment from 'moment';
import dateUtils from '../utils/DateHelper'

var CalendarPeriodHeading = React.createClass(
  {
    render: function() {
      var stdFmt = dateUtils['dateFormat'],
        dateDisplayFmt = 'DD MMM, YYYY',
        period;

      if (this.props.selectedDay) {
        period = moment(this.props.selectedDay, stdFmt).format(dateDisplayFmt);
      } else {
        period = moment(this.props.fromDate, stdFmt).format(dateDisplayFmt)
        + ' .. '
        + moment(this.props.toDate, stdFmt).format(dateDisplayFmt)
        + '(' + this.props.dateRange + ')';
      }
      return (
        <div className='l--push-bottom-half'>
          <h3 className='epsilon'>{period}</h3>
          <h4 className='zeta heading--sub'>Select a day for more detail</h4>
        </div>
      )
    }
  }
);

export default CalendarPeriodHeading;
