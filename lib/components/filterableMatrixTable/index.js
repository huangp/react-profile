import React from 'react';
var addons = require('react/addons');
import _ from 'lodash';
import ContentStateFilter from '../contentStateFilter';
import MatrixTable from '../matrixTable';
import CalendarPeriodHeading from '../calendarPeriodHeading';
import CategoryMatrixTable from '../categoryMatrixTable';

var FilterableMatrixTable = React.createClass({
  getDefaultProps: function() {
    return {
      contentStateOptions: [
        ['Total',''],
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
    var newState = addons.update(this.state, {
      selectedDay: {$set: day}
    });
    this.setState(newState);
  },

  onContentStateSelection: function(contentState) {
    var newState = addons.update(this.state, {
      selectedContentState: {$set: contentState}
    });
    this.setState(newState);
  },

  render: function () {
    var selectedState = this.state.selectedContentState,
      stateMatchFunc = this.isStateMatchSelected,
      filteredByContentStateData = _.cloneDeep(this.props.matrixData),
      filteredByContentStateAndFlattenedData
      ;
    if (this.state.selectedContentState !== 'Total') {
      _.forOwn(filteredByContentStateData, function(perDayMatrix) {
        _.remove(perDayMatrix, function(singleMatrix) {
          return !stateMatchFunc(selectedState, singleMatrix['savedState']);
        })
      });
    }
    if (this.state.selectedDay) {
      filteredByContentStateAndFlattenedData = filteredByContentStateData[this.state.selectedDay];
    } else {
      filteredByContentStateAndFlattenedData = _.flatten(_.values(filteredByContentStateData));
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
