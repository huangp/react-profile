import React from 'react';
import moment from 'moment-range';
import DayMatrix from './DayMatrix';
import Actions from '../actions/Actions';
import {ContentStates} from '../constants/Options';
import {DateRanges} from '../constants/Options';

var CalendarMonthMatrix = React.createClass({
  propTypes: {
    matrixData: React.PropTypes.arrayOf(
      React.PropTypes.shape(
        {
          date: React.PropTypes.string.isRequired,
          wordCount: React.PropTypes.number.isRequired,
        })
    ).isRequired,
    selectedDay: React.PropTypes.string,
    selectedContentState: React.PropTypes.oneOf(ContentStates).isRequired,
    dateRangeOption: React.PropTypes.oneOf(DateRanges).isRequired
  },

  getDefaultProps: function() {
    // this is to make week days locale aware and making sure it align with below display
    var now = moment(),
      weekDays = [],
      weekDay;
    for (var i = 0; i < 7; i++) {
      weekDay = now.weekday(i).format('ddd');
      weekDays.push(<th key={weekDay}>{weekDay}</th>);
    }
    return {
      weekDays: weekDays
    }
  },

  handleClearSelection: function() {
    Actions.clearSelectedDay();
  },

  render: function() {
    var calendarMonthMatrix = this,
      matrixData = this.props.matrixData,
      weekRows = [],
      dayTracker = 0,
      firstDay, firstDayWeekDay,
      dayColumns,
      heading,
      result,
      clearClass
      ;
    if (matrixData.length == 0) {
      return <table><tr><td>Loading</td></tr></table>
    }

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
      var key = calendarMonthMatrix.props.dateRangeOption + '-week' + index;
      return (
        <tr key={key}> {entry} </tr>
      );
    });

    clearClass = calendarMonthMatrix.props.selectedDay ? '' : 'is-hidden' ;
    heading = (
      <td colSpan="7" className='message--highlight'>
        <span className='txt--uppercase txt--align-center'>{firstDay.format('MMMM')}</span> (unit: words)
        <span className={clearClass}><button className="button--link" onClick={this.handleClearSelection}>Clear selection</button></span>
      </td>
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
