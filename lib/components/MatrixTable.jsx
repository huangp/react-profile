import React from 'react';
import _ from 'lodash';
import DayMatrix from './DayMatrix';
import utilsDate from '../utils/DateHelper';

var MatrixTable = React.createClass({
  render: function() {
    var rows = [],
      matrixTable = this;

    _.forOwn(this.props.matrixData, (function(value, key) {
      var totalWordCount = 0, day;
      value.forEach(function(matrix) {
        totalWordCount += matrix['wordCount'];
      });
      day = utilsDate.dayAsLabel(key, matrixTable.props.dateRange);
      rows.push(<DayMatrix date={day} key={key} wordCount={totalWordCount} onDaySelection={matrixTable.props.onDaySelection} />);
    }));
    return (
      <table className="l--push-bottom-1">
        {rows}
      </table>
    );
  }
});

export default MatrixTable;
