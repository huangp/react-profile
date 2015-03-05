import React from 'react';
import moment from 'moment-range';
import _ from 'lodash';
import DayMatrix from './DayMatrix';
import utilsDate from '../utils/DateHelper';

var CalendarMonthMatrix = React.createClass({
  getDefaultProps: function() {
    // this is to make week days locale aware and making sure it align with below display
    var now = moment(),
      weekDays = [];
    for (var i = 0; i < 7; i++) {
      weekDays.push(<th>{now.weekday(i).format('ddd')}</th>);
    }
    return {
      weekDays: weekDays
    }
  },

  render: function() {
    var calendarMonthMatrix = this,
      matrixData = this.props.matrixData,
      weekRows = [],
      dayTracker = 0,
      firstDay, firstDayWeekDay,
      dayColumns,
      heading,
      result
      ;

    firstDay = moment(matrixData[0]['date']);
    firstDayWeekDay = firstDay.weekday();

    matrixData.forEach(function(entry) {
      var date = entry['date'];

      if (dayTracker == 0) {
        dayColumns = [];
        weekRows.push(dayColumns);
      }
      if (weekRows.length == 0 && dayTracker < firstDayWeekDay) {
        // for the first week, we pre-fill missing week days
        dayColumns.push(<td key={firstDay.weekday(dayTracker).format()}></td>);
      } else {

        dayColumns.push(
          <td key={date}>
            <DayMatrix dateLabel={moment(date).format('Do')} date={date} wordCount={entry['wordCount']} showWords={false} {...calendarMonthMatrix.props} />
          </td>
        );
      }

      dayTracker++;
      if (dayTracker == 7) {
        // one week has finished. move on to next week.
        dayTracker = 0;
      }
    });

    result = weekRows.map(function(entry, index) {
      var key = calendarMonthMatrix.props.dateRange + '-week' + index;
      return (
        <tr key={key}> {entry} </tr>
      );
    });

    heading = (
      <td colSpan="7" className='txt--align-center message--highlight'><span className='txt--uppercase'>{firstDay.format('MMMM')}</span> (unit: words)</td>
    );

    return (
      <table className="l--push-bottom-1">
        <tbody>
          <tr>{heading}</tr>
          <tr>{this.props.weekDays}</tr>
          {result}
        </tbody>
      </table>
    );
  }
});

export default CalendarMonthMatrix;
