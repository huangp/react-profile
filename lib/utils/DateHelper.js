import moment from 'moment-range';

var DateHelper = {
  dateFormat: 'YYYY-MM-DD',
  getDateRangeFromOption: function (dateRangeOption) {
    var now = moment(),
      dateFormat = this.dateFormat,
      dates = [],
      range,
      fromDate,
      toDate;

    switch(dateRangeOption) {
      case 'This Week':
        fromDate = moment().weekday(0);
        toDate = moment();
        break;
      case 'Last Week':
        fromDate = moment().weekday(-7);
        toDate = moment().weekday(-1);
        break;
      case 'This Month':
        fromDate = moment().date(1);
        toDate = moment();
        break;
      case 'Last Month':
        fromDate = moment().month(now.month() - 1).date(1);
        toDate = moment().date(0);
        break;
      default:
        console.error('selectedDateRange [%s] can not be matched. Using (This Week) instead.', dateRangeOption);
        fromDate = moment().weekday(0);
        toDate = moment();
    }

    range = moment().range(fromDate, toDate);

    range.by('days', function(moment) {
      dates.push(moment.format(dateFormat));
    });

    return {
      fromDate: fromDate.format(dateFormat),
      toDate: toDate.format(dateFormat),
      dates: dates
    }
  },

  dayAsLabel: function(dateStr, numOfDays, useFullName) {
    var date = moment(dateStr),
      dayOfWeekFmt,
      dayOfMonthFmt;

    dayOfWeekFmt = useFullName ? 'dddd' : 'ddd';
    dayOfMonthFmt = useFullName ? 'Do' : 'D';
    if (numOfDays < 8) {
      return date.format(dayOfWeekFmt);
    } else {
      return date.format(dayOfMonthFmt);
    }
  }
};

export default DateHelper;
