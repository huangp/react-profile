import React from 'react';
import _ from 'lodash';
import DayMatrix from './DayMatrix';
import utilsDate from '../utils/DateHelper';

var MatrixTable = React.createClass({
  handleClearSelection: function(event) {
    this.props.onDaySelection(null);
  },

  render: function() {
    var matrixTable = this,
      numOfDays = this.props.matrixData.length,
      matrixData = this.props.matrixData,
      rows,
      clearClass,
      detailsClass;

    clearClass = matrixTable.props.selectedDay ? '' : 'is-hidden' ;
    detailsClass = !matrixTable.props.selectedDay ? 'txt--understated' : 'is-hidden' ;

    // TODO switch to calendar view for month so that we don't need to hide 0 matrices
    if (numOfDays > 7) {
      matrixData = this.props.matrixData.filter(function(entry) {
        return entry['wordCount'] > 0;
      });
    }

    rows = matrixData.map(function(entry) {
      var label = utilsDate.dayAsLabel(entry['date'], numOfDays, true);
      return (
        <li key={entry['date']}>
          <DayMatrix dateLabel={label} date={entry['date']} wordCount={entry['wordCount']} {...matrixTable.props} />
        </li>);
    });

    return (
      <div>
        <h3 className="epsilon txt--uppercase">Daily Activity</h3>
        <p className={clearClass}><button className="button--link" onClick={this.handleClearSelection}>Clear selection</button></p>
        <p className={detailsClass}>Select a day below for more detail</p>
        <div className="l--push-bottom-1">
          <ul className="list--no-bullets">{rows}</ul>
        </div>
      </div>
    );
  }
});

export default MatrixTable;
