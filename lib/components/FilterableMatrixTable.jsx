import React from 'react/addons';
import _ from 'lodash';
import ContentStateFilter from './ContentStateFilter';
import MatrixTable from './MatrixTable';
import CalendarPeriodHeading from './CalendarPeriodHeading';
import CategoryMatrixTable from './CategoryMatrixTable';

var FilterableMatrixTable = React.createClass({
  getDefaultProps: function() {
    return {
      contentStateOptions: [
        ['Total', 'txt--secondary'],
        ['Approved', 'txt--highlight'],
        ['Translated', 'txt--success'],
        ['Needs Work', 'txt--unsure']]
    }
  },

  getInitialState: function() {
    return {
      selectedContentState: 'Total',
      selectedDay: null
    }
  },

  isStateMatchSelected: function(selectedOption, savedState) {
    if (selectedOption === 'Total') {
      return true;
    } else if (selectedOption === 'Needs Work') {
      // crazy terminology mess
      return savedState === 'NeedReview';
    } else {
      return savedState === selectedOption;
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
    var selectedState = this.state.selectedContentState,
      filterableMatrixTable = this,
      filteredByContentStateData = [],
      filteredByContentStateAndFlattenedData,
      selectedDayIndex
      ;
    if (this.state.selectedContentState !== 'Total') {
      _.forEach(this.props.matrixData, function(perDayMatrix) {
        if (filterableMatrixTable.isStateMatchSelected(selectedState, perDayMatrix['savedState'])) {
          filteredByContentStateData.push(perDayMatrix);
        }
      });
    } else {
      filteredByContentStateData = this.props.matrixData;
    }
    if (this.state.selectedDay) {
      selectedDayIndex = _.findIndex(filteredByContentStateData, function(entry) {
        return _.keys(entry)[0] == filterableMatrixTable.state.selectedDay;
      });
      filteredByContentStateAndFlattenedData = filteredByContentStateData[selectedDayIndex];
    } else {
      filteredByContentStateAndFlattenedData = _.flatten(filteredByContentStateData.map(function(eachDay) {
        return _.values(eachDay);
      }));
    }
    return (
      <div>
        <ContentStateFilter {...this.props} selectedContentState={this.state.selectedContentState} onContentStateSelection={this.onContentStateSelection} />
        <MatrixTable matrixData={filteredByContentStateData} onDaySelection={this.onDaySelection} dateRange={this.props.dateRange} />
        <CalendarPeriodHeading fromDate={this.props.fromDate} toDate={this.props.toDate} dateRange={this.props.dateRange}/>
        <CategoryMatrixTable matrixData={filteredByContentStateAndFlattenedData} category='localeId' categoryName='Languages' />
        <CategoryMatrixTable matrixData={filteredByContentStateAndFlattenedData} category='projectSlug' categoryName='Projects' />
      </div>
    )
  }
});

export default FilterableMatrixTable;
