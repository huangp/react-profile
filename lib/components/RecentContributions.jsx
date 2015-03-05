import React from 'react';
import Request from 'superagent';
import ContributionChart from './ContributionChart';
import DropDown from './DropDown';
import FilterableMatrixTable from './FilterableMatrixTable';
import utilsDate from '../utils/DateHelper';
import dataFilter from '../utils/DataFilters';

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
        data: []
      }
    },

    componentDidMount: function() {
      this.loadFromServer(this.state.selectedDateRange);
    },

    loadFromServer: function(dateRangeOption) {
      var dateRange = utilsDate.getDateRangeFromOption(dateRangeOption),
        url = this.props.baseUrl + dateRange.fromDate + '..' + dateRange.toDate;

      // console.info('about to load from server: %s..%s', dateRange.fromDate,
      // dateRange.toDate);

      // we turn off cache because it seems like if server(maybe just node?)
      // returns 304 unmodified, it won't even reach the callback!
      Request.get(url)
        .set("Cache-Control", "no-cache, no-store, must-revalidate")
        .set("Pragma", "no-cache")
        .set("Expires", 0)
        .end((function (res) {
          if (res.error) {
            console.error(url, res.status, res.error.toString());
          } else {
            console.log('setting state from new response:' + res['body']);
            this.setState(
              {
                data: res['body'],
                selectedDateRange: dateRangeOption
              }
            );
          }
      }).bind(this))
    },

    onDateRangeSelection: function(dateRange) {
      this.loadFromServer(dateRange);
    },

    render: function() {
      var dateRange = utilsDate.getDateRangeFromOption(this.state.selectedDateRange),
        totalWordCountsForEachDay;

      totalWordCountsForEachDay = dataFilter.transformToTotalWordCountsForEachDay(
        this.state.data,
        dateRange);

      return (
        <div className="l__wrapper">
          <div className="l--push-bottom-1">
            <div className="l--float-right txt--uppercase">
              <DropDown options={this.props.dateRangeOptions} selectedOption={this.state.selectedDateRange} onOptionSelection={this.onDateRangeSelection} />
            </div>
            <h2 className='delta txt--uppercase'>Recent Contributions</h2>
          </div>
          <div className="l--push-bottom-1">
            <ContributionChart wordCountForEachDay={totalWordCountsForEachDay} dateRange={this.state.selectedDateRange} />
          </div>
          <FilterableMatrixTable serverData={this.state.data} wordCountForEachDay={totalWordCountsForEachDay} fromDate={dateRange['fromDate']} toDate={dateRange['toDate']} dateRange={this.state.selectedDateRange} />
        </div>
      )
    }
  }
);

export default RecentContributions;
