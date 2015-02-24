import React from 'react';
import utilsDate from '../utils/DateHelper';
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
    totalNeedsWork: totalNeedsWork,
    totalActivity: totalApproved + totalTranslated + totalNeedsWork
  }
};

function convertMatrixDataToChartData (matrixData, dateRangeOption) {
  var chartData = {
    labels: [],
    datasets: [
      {
        label: 'Total',
        fillColor: 'rgba(65, 105, 136, .2)',
        strokeColor: 'rgb(65, 105, 136)',
        pointColor: 'rgb(65, 105, 136)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgb(65, 105, 136)',
        data: []
      },
      {
        label: 'Translated',
        fillColor: 'rgba(112,169,139, .2)',
        strokeColor: 'rgb(112,169,139)',
        pointColor: 'rgb(112,169,139)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgb(112,169,139)',
        data: []
      },
      {
        label: 'Needs Work',
        fillColor: 'rgba(224,195,80, .2)',
        strokeColor: 'rgb(224,195,80)',
        pointColor: 'rgb(224,195,80)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgb(224,195,80)',
        data: []
      },
      {
        label: 'Approved',
        fillColor: "rgba(78, 159, 221, .2)",
        strokeColor: 'rgb(78, 159, 221)',
        pointColor: 'rgb(78, 159, 221)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgb(78, 159, 221)',
        data: []
      }
    ]
  };

  matrixData.forEach(function(value) {
    var date = _.keys(value)[0],
      total;

    chartData.labels.push(utilsDate.dayAsLabel(date, dateRangeOption));

    total = getTotalWordCountsForDay(value[date]);

    chartData['datasets'][0]['data'].push(total['totalActivity']);
    chartData['datasets'][1]['data'].push(total['totalTranslated']);
    chartData['datasets'][2]['data'].push(total['totalNeedsWork']);
    chartData['datasets'][3]['data'].push(total['totalApproved']);
  });

  return chartData;
};

var ContributionChart = React.createClass({
  getDefaultProps: function() {
    return {
      chartOptions: {
        animationEasing: "easeOutQuart",
        bezierCurve : true,
        bezierCurveTension : 0.4,
        pointDot : true,
        pointDotRadius : 3,
        // This doesn't seem to work
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        // TODO: Need to set this to true but it breaks
        responsive: true,
        showTooltips: true,
        scaleFontFamily: '"Source Sans Pro", "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
        scaleFontColor: "#c6d2db",
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(198, 210, 219, .2)",
        tooltipFillColor: "rgba(255,255,255,0.8)",
        // String - Tooltip label font declaration for the scale label
        tooltipFontFamily: '"Source Sans Pro", "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
        tooltipFontSize: 14,
        tooltipFontStyle: '400',
        tooltipFontColor: 'rgb(132, 168, 196)',
        tooltipTitleFontFamily: '"Source Sans Pro", "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
        tooltipTitleFontSize: 14,
        tooltipTitleFontStyle: '400',
        tooltipTitleFontColor: 'rgb(65, 105, 136)',
        tooltipYPadding: 6,
        tooltipXPadding: 6,
        tooltipCaretSize: 6,
        tooltipCornerRadius: 2,
        tooltipXOffset: 10,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
      }
    }
  },
  render: function() {
    var chartData = convertMatrixDataToChartData(this.props.matrixData, this.props.dateRange);
    return (
      <LineChart data={chartData} options={this.props.chartOptions} width="800" height="300"/>
    )
  }
});

export default ContributionChart;
