import React from 'react';
import _ from 'lodash';
import DayMatrix from './DayMatrix';
import utilsDate from '../utils/DateHelper';

var MatrixTable = React.createClass({
  render: function() {
    var matrixTable = this,
      numOfDays = this.props.matrixData.length,
      matrixData = this.props.matrixData,
      rows;

    // TODO switch to calendar view for month so that we don't need to hide 0 matrices
    if (numOfDays > 7) {
      matrixData = this.props.matrixData.filter(function(entry) {
        return entry['wordCount'] > 0;
      });
    }

    rows = matrixData.map(function(entry) {
      var label = utilsDate.dayAsLabel(entry['date'], numOfDays, true);
      return (<DayMatrix dateLabel={label} key={entry['date']} date={entry['date']} wordCount={entry['wordCount']} onDaySelection={matrixTable.props.onDaySelection} selectedDay={matrixTable.props.selectedDay} />);
    });

    return (
      <table className="l--push-bottom-1">
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

export default MatrixTable;
