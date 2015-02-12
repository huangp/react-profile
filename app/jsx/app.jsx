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
        <div >
          <span onClick={this.handleDayClick}>{this.props.date}</span>
          <span >{this.props.wordCount}</span>
        </div>);
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

      this.props.contentStateOptions.forEach(function(option) {
        var selectedStyle = selected === option ? 'bx--round bg--primary' : '';
        optionItems.push(<li key={option} onClick={clickHandler} className={selectedStyle} >{option}</li>);
      });
      return (
        <ul className='list--slat-horizontal'>{optionItems}</ul>
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
        rows.push(<li key={key}><DayMatrix date={key} wordCount={totalWordCount} onDaySelection={daySelectionHandler} /></li>);
      }));
      return (
        <ul>
          {rows}
        </ul>);
    }
  });

var CalendarPeriodHeading = React.createClass(
  {
    render: function() {
      return (
        <div>
          <h3>{this.props.fromDate} - {this.props.toDate} ({this.props.dateRange})</h3>
          <h4 className='heading--sub'>Select a day for more detail</h4>
        </div>
      )
    }
  }
);

var CategoryHeading = React.createClass(
  {
    render: function() {
      return <h3 className='txt--uppercase txt--understated'>{this.props.content}</h3>
    }
  }
);

var CategoryItemMatrix = React.createClass(
  {
    render: function() {
      return <li><span>{this.props.itemName}</span><span>{this.props.wordCount} words</span></li>
    }
  }
);



var LanguageMatrixTable = React.createClass(
  {
    render: function() {
      var languageMatrix = {},
        rows = [];

      this.props.matrixData.forEach(function(matrix) {
        var locale = matrix['localeId'];
        if (languageMatrix[locale]) {
          languageMatrix[locale] += matrix['wordCount'];
        } else {
          languageMatrix[locale] = matrix['wordCount'];
        }
      });
      _.forOwn(languageMatrix, function(value, key) {
        rows.push(<CategoryItemMatrix key={key} itemName={key} wordCount={value} />)
      });
      return (
        <div>
          <CategoryHeading content='Languages' />
          <ul>{rows}</ul>
        </div>
      )
    }
  }
);

var ProjectsMatrixTable = React.createClass(
  {
    render: function() {
      var projectMatrix = {},
        rows = [];

      this.props.matrixData.forEach(function(matrix) {
        var project = matrix['projectSlug'];
        if (projectMatrix[project]) {
          projectMatrix[project] += matrix['wordCount'];
        } else {
          projectMatrix[project] = matrix['wordCount'];
        }
      });
      _.forOwn(projectMatrix, function(value, key) {
        rows.push(<CategoryItemMatrix key={key} itemName={key} wordCount={value} />)
      });
      return (
        <div>
          <CategoryHeading content='Projects' />
          <ul>{rows}</ul>
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
          <ul>{rows}</ul>
        </div>
      )
    }
  }
);

var FilterableMatrixTable = React.createClass(
  {
    getDefaultProps: function() {
      return {
        contentStateOptions: ['Total', 'Approved', 'Translated', 'Needs Work']
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
      // TODO pahuang this should be dynamically calculated
      var dateRange = 'this week',
        selectedState = this.state.selectedContentState,
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
          <ContentStateFilter contentStateOptions={this.props.contentStateOptions} selectedContentState={this.state.selectedContentState} onContentStateSelection={this.onContentStateSelection} />
          <MatrixTable matrixData={filteredByContentStateData} onDaySelection={this.onDaySelection} />
          <CalendarPeriodHeading fromDate={this.props.fromDate} toDate={this.props.toDate} dateRange={dateRange}/>
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
          <a className="dropdown__toggle dropdown__toggle--large js-dropdown__toggle" href="#">{selected}</a>
          <ul className="dropdown__content js-dropdown__content">
          {optionList}
          </ul>
        </span>
      )
    }
  }
);

var RecentContributions = React.createClass(
  {
    getDefaultProps: function() {
      return {
        dateRangeOptions: ['This Week', 'Last Week', 'This Month', 'Last Month']
      }
    },

    getInitialState: function() {
      return {
        selectedDateRange: this.props.dateRangeOptions[0]
      }
    },

    onDateRangeSelection: function(dateRange) {
      this.setState({selectedDateRange: dateRange});
    },

    render: function() {
      var fromDate = '2015-02-03',
        toDate = '2015-02-10';
      return (
        <div>
          <span className='txt--uppercase txt--important'>Recent Contributions</span>
          <DropDown options={this.props.dateRangeOptions} selectedOption={this.state.selectedDateRange} onOptionSelection={this.onDateRangeSelection} />
          <FilterableMatrixTable matrixData={this.props.matrixData} fromDate={fromDate} toDate={toDate} />
        </div>
      )
    }
  }
);

var data = {
  "2015-02-09 Australia/Brisbane": [
    {
      "projectSlug": "properties-test",
      "versionSlug": "master",
      "localeId": "fr",
      "savedState": "Translated",
      "wordCount": 8
    },
    {
      "projectSlug": "properties-test",
      "versionSlug": "master",
      "localeId": "fr",
      "savedState": "NeedReview",
      "wordCount": 6
    }
  ],
  "2015-02-10 Australia/Brisbane": [
    {
      "projectSlug": "properties-test",
      "versionSlug": "master",
      "localeId": "fr",
      "savedState": "Translated",
      "wordCount": 14
    },
    {
      "projectSlug": "properties-test",
      "versionSlug": "master",
      "localeId": "es",
      "savedState": "NeedReview",
      "wordCount": 7
    }
  ]
};

React.render(<RecentContributions matrixData={data} />, document.getElementById('mountPoint'));
