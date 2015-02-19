import React from 'react';
import ContributionChart from '../contributionChart';
import DropDown from '../dropDown';
import FilterableMatrixTable from '../filterableMatrixTable';
import utilsDate from '../../utilities/utilsDate';
import Request from 'superagent';

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
      var dateRange = utilsDate.getDateRangeFromOption(dateRangeOption);
      console.info('about to load from server: %s..%s', dateRange.fromDate, dateRange.toDate);

      Request.get(this.props.baseUrl + dateRange.fromDate + '..' + dateRange.toDate).end((function (res) {
        if (res.ok) {
          this.setState(
            {
              data: res['body'],
              selectedDateRange: dateRangeOption
            }
          );
        } else {
          console.error(this.props.url, res.status, res.error.toString());
        }
      }).bind(this))
    },

    onDateRangeSelection: function(dateRange) {
      console.log('%s -> %s', this.state.selectedDateRange, dateRange);
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

      console.info(paddedData);
      return (
        <div>
          <div>
            <ContributionChart matrixData={paddedData} dateRange={this.state.selectedDateRange} />
          </div>
          <span className='txt--uppercase txt--important'>Recent Contributions</span>
          <DropDown options={this.props.dateRangeOptions} selectedOption={this.state.selectedDateRange} onOptionSelection={this.onDateRangeSelection} />
          <FilterableMatrixTable matrixData={this.state.data} fromDate={dateRange['fromDate']} toDate={dateRange['toDate']} dateRange={this.state.selectedDateRange} />
        </div>
      )
    }
  }
);

export default RecentContributions;
