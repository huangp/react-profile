import React from 'react';
import _ from 'lodash';
import DayMatrix from '../dayMatrix';
import utilsDate from '../../utilities/utilsDate';

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
      rows.push(<div key={key} className='w--1 g__item'>
                  <DayMatrix date={day} wordCount={totalWordCount} onDaySelection={matrixTable.props.onDaySelection} />
                </div>);
    }));
    return (
      <div className='g'>
        {rows}
      </div>
    );
  }
});

export default MatrixTable;
