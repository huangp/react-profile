import React from 'react';
import Request from 'superagent';
import ContributionChart from './ContributionChart';
import DropDown from './DropDown';
import FilterableMatrixTable from './FilterableMatrixTable';
import utilsDate from '../utils/DateHelper';

/* @flow */

var RecentContributions = React.createClass(
  {
    getDefaultProps: function() {
      return {
        dateRangeOptions: ['This Week', 'Last Week', 'This Month', 'Last Month']
      }
    },

    getInitialState: function() {
      return {
        selectedDateRange: 'This Week',
        data: {}
      }
    },

    componentDidMount: function() {
      this.loadFromServer(this.state.selectedDateRange);
    },

    loadFromServer: function(dateRangeOption) {
      var dateRange = utilsDate.getDateRangeFromOption(dateRangeOption),
        url = this.props.baseUrl + dateRange.fromDate + '..' + dateRange.toDate;

      // console.info('about to load from server: %s..%s', dateRange.fromDate, dateRange.toDate);

      Request.get(url).end((function (res) {
        if (res.ok) {
          this.setState(
            {
              data: res['body'],
              selectedDateRange: dateRangeOption
            }
          );
        } else {
          console.error(url, res.status, res.error.toString());
        }
      }).bind(this))
    },

    onDateRangeSelection: function(dateRange) {
      this.loadFromServer(dateRange);
    },

    render: function() {
      var dataInState = this.state.data,
        dateRange = utilsDate.getDateRangeFromOption(this.state.selectedDateRange),
        paddedData = [],
        datesOfThisWeek = dateRange['dates'];

      // fill in dates where there is no data in it
      datesOfThisWeek.forEach(function(date) {
        var entry = {};
        entry[date] = dataInState[date] || [];
        paddedData.push(entry);
      });

      return (
        <div className="l__wrapper">
          <div className="l--push-bottom-1">
            <div className="l--float-right txt--uppercase">
              <DropDown options={this.props.dateRangeOptions} selectedOption={this.state.selectedDateRange} onOptionSelection={this.onDateRangeSelection} />
            </div>
            <h2 className='delta txt--uppercase'>Recent Contributions</h2>
          </div>
          <div className="l--push-bottom-1">
            <ContributionChart matrixData={paddedData} dateRange={this.state.selectedDateRange} />
          </div>
          <FilterableMatrixTable matrixData={this.state.data} fromDate={dateRange['fromDate']} toDate={dateRange['toDate']} dateRange={this.state.selectedDateRange} />
        </div>
      )
    }
  }
);

export default RecentContributions;
