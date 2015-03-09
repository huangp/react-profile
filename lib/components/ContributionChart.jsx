import React from 'react';
import utilsDate from '../utils/DateHelper';
import { Line } from 'react-chartjs';
import {DateRanges} from '../constants/Options';

var LineChart = Line;

var defaultChartOptions = {
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
  scaleShowGridLines : false,
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
};

function convertMatrixDataToChartData(matrixData) {
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
  },
    numOfDays = matrixData.length;

  matrixData.forEach(function(value) {
    chartData.labels.push(utilsDate.dayAsLabel(value['date'], numOfDays));

    chartData['datasets'][0]['data'].push(value['totalActivity']);
    chartData['datasets'][1]['data'].push(value['totalTranslated']);
    chartData['datasets'][2]['data'].push(value['totalNeedsWork']);
    chartData['datasets'][3]['data'].push(value['totalApproved']);
  });

  return chartData;
}

var ContributionChart = React.createClass({
  propTypes: {
    dateRangeOption: React.PropTypes.oneOf(DateRanges).isRequired,
    wordCountForEachDay: React.PropTypes.arrayOf(
      React.PropTypes.shape(
        {
          date: React.PropTypes.string.isRequired,
          totalActivity: React.PropTypes.number.isRequired,
          totalApproved: React.PropTypes.number.isRequired,
          totalTranslated: React.PropTypes.number.isRequired,
          totalNeedsWork: React.PropTypes.number.isRequired
        })
    ).isRequired
  },

  getDefaultProps: function() {
    return {
      chartOptions: defaultChartOptions
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.dateRangeOption !== nextProps.dateRangeOption
      || this.props.wordCountForEachDay.length !== nextProps.wordCountForEachDay.length;
  },

  render: function() {
    var chartData = convertMatrixDataToChartData(this.props.wordCountForEachDay);
    return (
      <LineChart data={chartData} options={this.props.chartOptions} width="800" height="250"/>
    )
  }
});

export default ContributionChart;
