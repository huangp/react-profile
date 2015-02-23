import React from 'react';

var CalendarPeriodHeading = React.createClass(
  {
    render: function() {
      return (
        <div className='l--push-bottom-half'>
          <h3 className='epsilon txt--uppercase'>{this.props.fromDate} - {this.props.toDate} ({this.props.dateRange})</h3>
          <h4 className='zeta heading--sub'>Select a day for more detail</h4>
        </div>
      )
    }
  }
);

export default CalendarPeriodHeading;
