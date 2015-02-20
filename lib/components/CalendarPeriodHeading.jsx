import React from 'react';

var CalendarPeriodHeading = React.createClass(
  {
    render: function() {
      return (
        <div>
          <h3>{this.props.fromDate} - {this.props.toDate} ({this.props.dateRange})</h3>
          <h4 className='heading--sub'>Select a day for more detail</h4>
        </div>
      )
    }
  }
);

export default CalendarPeriodHeading;
