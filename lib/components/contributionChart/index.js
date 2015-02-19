import React from 'react';
import utilsDate from '../../utilities/utilsDate';
var LineChart = require('react-chartjs').Line;

function getTotalWordCountsForDay (matrixArray) {
  // TODO should do some precondition check
  var totalApproved = 0,
    totalTranslated = 0,
    totalNeedsWork = 0;

  matrixArray.forEach(function(matrix) {
    switch(matrix['savedState']) {
      case 'Approved':
        totalApproved += matrix['wordCount'];
        break;
      case 'Translated':
        totalTranslated += matrix['wordCount'];
        break;
      case 'NeedReview':
        totalNeedsWork += matrix['wordCount'];
        break;
      default:
        throw new Error('unrecognized state:' + matrix['savedState']);
    }
  });
  return {
    totalApproved: totalApproved,
    totalTranslated: totalTranslated,
    totalNeedsWork: totalNeedsWork
  }
};

function convertMatrixDataToChartData (matrixData, dateRangeOption) {
  var chartData = {
    labels: [],
    datasets: [
      {
        label: 'Approved',
        fillColor: "rgba(78, 159, 221, 0.2)",
        strokeColor: 'rgba(78, 159, 221, 1)',
        pointColor: 'rgba(78, 159, 221, 1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(78, 159, 221, 1)',
        data: []
      },
      {
        label: 'Translated',
        fillColor: 'rgba(112,169,139, 0.2)',
        strokeColor: 'rgba(112,169,139,1)',
        pointColor: 'rgba(112,169,139,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(112,169,139,1)',
        data: []
      },
      {
        label: 'Needs Work',
        fillColor: 'rgba(224,195,80, 0.2)',
        strokeColor: 'rgba(224,195,80,1)',
        pointColor: 'rgba(224,195,80,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(224,195,80,1)',
        data: []
      }
    ]
  };

  matrixData.forEach(function(value) {
    var date = _.keys(value)[0],
      total;

    chartData.labels.push(utilsDate.dayAsLabel(date, dateRangeOption));

    total = getTotalWordCountsForDay(value[date]);

    chartData['datasets'][0]['data'].push(total['totalApproved']);
    chartData['datasets'][1]['data'].push(total['totalTranslated']);
    chartData['datasets'][2]['data'].push(total['totalNeedsWork']);
  });

  return chartData;
};

var ContributionChart = React.createClass({
  getDefaultProps: function() {
    return {
      chartOptions: {}
    }
  },
  render: function() {
    var chartData = convertMatrixDataToChartData(this.props.matrixData, this.props.dateRange);
    return (
      <LineChart data={chartData} options={this.props.chartOptions}/>
    )
  }
});

export default ContributionChart;
