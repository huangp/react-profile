var DayMatrix = React.createClass(
  {
    handleDayClick: function(event) {
      var dayChosen = event.target.innerText;
      if (this.props.selectedDay == dayChosen) {
        // click the same day again will cancel selection
        this.props.onDaySelection(null);
      } else {
        this.props.onDaySelection(dayChosen);
      }
    },
    render: function() {
      return (
        <div className='g l--pad-v-quarter'>
          <span className='w--3-4 g__item l--pad-h-half' onClick={this.handleDayClick}>{this.props.date}</span>
          <span className='w--1-4 g__item l--pad-h-half txt--align-right' >{this.props.wordCount} <span className='txt--neutral'>words</span></span>
        </div>
      );
    }
  });

var ContentStateFilter = React.createClass(
  {
    onFilterOptionClicked: function(event) {
      var optionInnerText = event.target.innerText;
      if (this.props.selectedContentState !== optionInnerText) {
        this.props.onContentStateSelection(optionInnerText);
      }
    },
    render: function() {
      var optionItems = [],
        selected = this.props.selectedContentState,
        clickHandler = this.onFilterOptionClicked;

      this.props.contentStateOptions.forEach(function(optionAndStyle) {
        var option = optionAndStyle[0],
          optionStyle = optionAndStyle[1];

        var buttonStyle = selected === option ? 'badge--highlight' : optionStyle;
        optionItems.push(<span key={option} onClick={clickHandler} className={buttonStyle + ' l--pad-h-quarter txt--align-center w--1-4 g__item'}>
                           {option}
                         </span>);
      });
      return (
        <div className='g'>{optionItems}</div>
      );
    }
  }
);

var MatrixTable = React.createClass(
  {
    render: function() {
      var rows = [],
        daySelectionHandler = this.props.onDaySelection;

      _.forOwn(this.props.matrixData, (function(value, key) {
        var totalWordCount = 0;
        value.forEach(function(matrix) {
          totalWordCount += matrix['wordCount'];
        });
        rows.push(<div key={key} className='w--1 g__item'>
                    <DayMatrix date={key} wordCount={totalWordCount} onDaySelection={daySelectionHandler} />
                  </div>);
      }));
      return (
        <div className='g'>
          {rows}
        </div>
      );
    }
  });

var CalendarPeriodHeading = React.createClass(
  {
    render: function() {
      return (
        <div>
          <h4>{this.props.fromDate} - {this.props.toDate} ({this.props.dateRange})</h4>
          <h5 className='heading--sub'>Select a day for more detail</h5>
        </div>
      )
    }
  }
);

var CategoryHeading = React.createClass(
  {
    render: function() {
      return <h4 className='txt--uppercase txt--neutral'>{this.props.content}</h4>
    }
  }
);

var CategoryItemMatrix = React.createClass(
  {
    render: function() {
      return (
        <div className='g l--pad-v-quarter'>
          <span className='w--3-4 g__item l--pad-h-half'>{this.props.itemName}</span>
          <span className='w--1-4 g__item l--pad-h-half txt--align-right' >{this.props.wordCount} <span className='txt--neutral'>words</span></span>
        </div>
      )
    }
  }
);

var CategoryMatrixTable = React.createClass(
  {
    render: function() {
      var categoryMatrix = {},
        rows = [],
        // TODO validate category is one of the key in matrix object
        categoryField = this.props.category;

      this.props.matrixData.forEach(function(matrix) {
        var field = matrix[categoryField];
        if (categoryMatrix[field]) {
          categoryMatrix[field] += matrix['wordCount'];
        } else {
          categoryMatrix[field] = matrix['wordCount'];
        }
      });
      _.forOwn(categoryMatrix, function(value, key) {
        rows.push(<CategoryItemMatrix key={key} itemName={key} wordCount={value} />)
      });
      return (
        <div>
          <CategoryHeading content={this.props.categoryName} />
          <div className='g'>{rows}</div>
        </div>
      )
    }
  }
);

var FilterableMatrixTable = React.createClass(
  {
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
      //console.log(this.props.matrixData);
      return (
        <div>
          <ContentStateFilter {...this.props} selectedContentState={this.state.selectedContentState} onContentStateSelection={this.onContentStateSelection} />
          <MatrixTable matrixData={filteredByContentStateData} onDaySelection={this.onDaySelection} />
          <CalendarPeriodHeading fromDate={this.props.fromDate} toDate={this.props.toDate} dateRange={this.props.dateRange}/>
          <CategoryMatrixTable matrixData={filteredByContentStateAndFlattenedData} category='localeId' categoryName='Languages' />
          <CategoryMatrixTable matrixData={filteredByContentStateAndFlattenedData} category='projectSlug' categoryName='Projects' />
        </div>
      )
    }
  }
);

var DropDown = React.createClass(
  {
    onOptionClicked: function(event) {
      var clickedOption = event.target.innerText;
      if (this.props.selectedOption != clickedOption) {
        this.props.onOptionSelection(clickedOption);
      }
    },

    render: function() {
      var options = this.props.options,
        selected = this.props.selectedOption,
        handler = this.onOptionClicked,
        optionList;

      optionList = options.map(function (option) {
        var className = option === selected ? 'is-active' : '';
        return <li key={option}>
          <a className={className} href="#" onClick={handler}>{option}</a>
        </li>
      });

      return (
        <span className="dropdown dropdown--inline js-dropdown">
          <a className="dropdown__toggle js-dropdown__toggle" href="#">{selected}</a>
          <ul className="dropdown__content js-dropdown__content">
          {optionList}
          </ul>
        </span>
      )
    }
  }
);

var ContributionChart = React.createClass(
  {
    statics: {
      getTotalWordCountsForDay: function(matrixArray) {
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
            case 'NeedsReview':
              totalNeedsWork += matrix['wordCount'];
              break;
          }
        });
        return {
          totalApproved: totalApproved,
          totalTranslated: totalTranslated,
          totalNeedsWork: totalNeedsWork
        }
      },
      convertMatrixDataToChartData: function(matrixData) {
        var chartData = {
          labels: [],
          series: [
            {
              name: 'Approved',
              data: []
            },
            {
              name: 'Translated',
              data: []
            },
            {
              name: 'Needs Work',
              data: []
            }
          ]
        };

        _.forOwn(matrixData, function(value, key) {
          var total;

          chartData.labels.push(key);

          total = ContributionChart.getTotalWordCountsForDay(value);

          chartData['series'][0]['data'].push(total['totalApproved']);
          chartData['series'][1]['data'].push(total['totalTranslated']);
          chartData['series'][2]['data'].push(total['totalNeedsWork']);
        });
        return chartData;
      }
    },

    componentDidMount: function() {
      var chart = this,
        chartData = ContributionChart.convertMatrixDataToChartData(this.props.matrixData);

      console.info('componentDidMount: %s', chartData);
      ContributionChart.chart = new Chartist.Bar('.ct-chart', chartData);
      console.log('chart instance stored?' + ContributionChart.chart);
    },

    componentWillUpdate: function(nextProps, nextState) {
      var chartData = ContributionChart.convertMatrixDataToChartData(
        nextProps.matrixData);
      ContributionChart.chart.update(chartData);
    },

    render: function() {
      var chartData = ContributionChart.convertMatrixDataToChartData(
        this.props.matrixData);
      if (ContributionChart.chart) {
        ContributionChart.chart.update(chartData);
      }
      console.log('rendering chart');
      return (
        <div className="ct-chart ct-perfect-fourth"></div>
      )
    }
  }
);

var RecentContributions = React.createClass(
  {
    statics: {
      getDateRangeFromState: function (dateRangeOption) {
        var now = moment(),
          dateFormat = 'YYYY-MM-DD',
          fromDate,
          toDate;

        switch(dateRangeOption) {
          case 'This Week':
            fromDate = moment().weekday(0).format(dateFormat);
            toDate = moment().format(dateFormat);
            break;
          case 'Last Week':
            fromDate = moment().weekday(-7).format(dateFormat);
            toDate = moment().weekday(-1).format(dateFormat);
            break;
          case 'This Month':
            fromDate = moment().date(1).format(dateFormat);
            toDate = moment().format(dateFormat);
            break;
          case 'Last Month':
            fromDate = moment().month(now.month() - 1).date(1).format(dateFormat);
            toDate = moment().date(0).format(dateFormat);
            break;
          default:
            console.error('selectedDateRange [%s] can not be matched. Using (This Week) instead.', dateRangeOption);
            fromDate = moment().weekday(0).format(dateFormat);
            toDate = moment().format(dateFormat);
        }

        return {
          fromDate: fromDate, toDate: toDate
        }
      }
    },
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
      var dateRange = RecentContributions.getDateRangeFromState(dateRangeOption);
      console.info('about to load from server: %s..%s', dateRange.fromDate, dateRange.toDate);
      $.ajax(
        {
          url: this.props.baseUrl + dateRange.fromDate + '..' + dateRange.toDate,
          dataType: 'json',
          success: function (data) {
            this.setState(
              {
                data: data,
                selectedDateRange: dateRangeOption
              }
            );
          }.bind(this),
          error: function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        }
      );
    },

    onDateRangeSelection: function(dateRange) {
      console.log('%s -> %s', this.state.selectedDateRange, dateRange);
      this.loadFromServer(dateRange);
    },

    render: function() {
      var dateRange = RecentContributions.getDateRangeFromState(this.state.selectedDateRange);

      return (
        <div>
          <ContributionChart matrixData={this.state.data} />
          <span className='txt--uppercase txt--important'>Recent Contributions</span>
          <DropDown options={this.props.dateRangeOptions} selectedOption={this.state.selectedDateRange} onOptionSelection={this.onDateRangeSelection} />
          <FilterableMatrixTable matrixData={this.state.data} fromDate={dateRange['fromDate']} toDate={dateRange['toDate']} dateRange={this.state.selectedDateRange} />
        </div>
      )
    }
  }
);
