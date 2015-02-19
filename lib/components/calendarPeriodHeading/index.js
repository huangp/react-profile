import React from 'react';

var CalendarPeriodHeading = React.createClass(
  {
    render: function() {
      return (
        <div>
          <h4>{this.props.fromDate} - {this.props.toDate} ({this.props.dateRange})</h4>
          <h5 className='heading--sub'>Select a day for more detail</h5>
        </div>
      )
    }
  }
);

export default CalendarPeriodHeading;
