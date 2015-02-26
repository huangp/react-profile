import React from 'react/addons';
import _ from 'lodash';
import ContentStateFilter from './ContentStateFilter';
import MatrixTable from './MatrixTable';
import CalendarPeriodHeading from './CalendarPeriodHeading';
import CategoryMatrixTable from './CategoryMatrixTable';
import dataFilter from '../utils/DataFilters'

var FilterableMatrixTable = React.createClass({
  getDefaultProps: function() {
    return {
      contentStateOptions: [
        ['Total', 'pill pill--secondary'],
        ['Approved', 'pill pill--highlight'],
        ['Translated', 'pill pill--success'],
        ['Needs Work', 'pill pill--unsure']]
    }
  },

  getInitialState: function() {
    return {
      selectedContentState: 'Total',
      selectedDay: null
    }
  },

  onDaySelection: function(day) {
    var newState = React.addons.update(this.state, {
      selectedDay: {$set: day}
    });
    this.setState(newState);
  },

  onContentStateSelection: function(contentState) {
    var newState = React.addons.update(this.state, {
      selectedContentState: {$set: contentState}
    });
    this.setState(newState);
  },

  render: function () {
    var selectedContentState = this.state.selectedContentState,
      categoryTables,
      dataFilteredByContentState,
      dataFilteredByContentStateAndDay;

    dataFilteredByContentState = dataFilter.mapTotalWordCountByContentState(this.props.wordCountForEachDay, selectedContentState);

    dataFilteredByContentStateAndDay = dataFilter.filterByContentStateAndDay(this.props.serverData, selectedContentState, this.state.selectedDay);

    if (dataFilteredByContentStateAndDay.length > 0) {
      categoryTables =
        [
          <CategoryMatrixTable key='locales' matrixData={dataFilteredByContentStateAndDay} category='localeId' categoryTitle='localeDisplayName' categoryName='Languages' />,
          <CategoryMatrixTable key='projects' matrixData={dataFilteredByContentStateAndDay} category='projectSlug' categoryTitle='projectName' categoryName='Projects' />
        ];
    } else {
      categoryTables = <div>No translation was done</div>
    }
    return (
      <div>
        <ContentStateFilter selectedContentState={selectedContentState} onContentStateSelection={this.onContentStateSelection} {...this.props}  />
        <MatrixTable matrixData={dataFilteredByContentState} onDaySelection={this.onDaySelection} dateRange={this.props.dateRange} selectedDay={this.state.selectedDay} />
        <CalendarPeriodHeading fromDate={this.props.fromDate} toDate={this.props.toDate} dateRange={this.props.dateRange} selectedDay={this.state.selectedDay}/>
        {categoryTables}
      </div>
    )
  }
});

export default FilterableMatrixTable;
