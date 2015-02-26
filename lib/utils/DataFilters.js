import dateUtils from './DateHelper';
import moment from 'moment';
import _ from 'lodash';

var DataFilters = {

  mapContentStateToFieldName: function (selectedOption) {
    switch (selectedOption) {
      case 'Total':
        return 'totalActivity';
      case 'Approved':
        return 'totalApproved';
      case 'Translated':
        return 'totalTranslated';
      case 'Needs Work':
        return 'totalNeedsWork';
    }
  },

  /**
   *
   * @param listOfMatrices this should be the result of
   *   DataFilters.transformToTotalWordCountsForEachDay().
   * @param {string} selectedContentState
   * @returns {{key: string, label: string, wordCount: number}[]}
   */
  mapTotalWordCountByContentState: function (listOfMatrices, selectedContentState) {
    var wordCountFieldName = this.mapContentStateToFieldName(selectedContentState);
    return listOfMatrices.map(function (entry) {
      return {
        date: entry['date'],
        wordCount: entry[wordCountFieldName]
      }
    });
  },

  /**
   *
   * @param listOfMatrices original server response
   * @param {string} selectedContentState
   * @param {string?} selectedDay optional day
   * @return filtered entries in same form as original server response
   */
  filterByContentStateAndDay: function (listOfMatrices, selectedContentState, selectedDay) {
    var filteredEntries = listOfMatrices,
      predicates = [],
      predicate;

    if (selectedDay) {
      predicates.push(function (entry) {
        return entry['savedDate'] === selectedDay;
      });
    }
    if (selectedContentState !== 'Total') {
      predicates.push(function(entry) {
        return entry['savedState'] === selectedContentState;
      });
    }
    if (predicates.length > 0) {
      predicate = function(entry) {
        return predicates.every(function(func) {
          return func.call({}, entry);
        });
      };
      filteredEntries = listOfMatrices.filter(predicate);
    }
    return filteredEntries;
  },

  /**
   *
   * @param listOfMatrices original server response
   * @param {{fromDate: string, toDate: string, dates: string[]}} dateRange see
   *   DateHelper.getDateRangeFromOption(string)
   * @returns {{label: string, date: string, totalApproved: number,
   *   totalTranslated: number, totalNeedsWork: number, totalActivity:
   *   number}[]}
   */
  transformToTotalWordCountsForEachDay: function (listOfMatrices, dateRange) {
    var datesOfThisPeriod = dateRange['dates'],
      result = [],
      index = 0;

    datesOfThisPeriod.forEach(function (dateStr) {
      var label = dateUtils.dayAsLabel(dateStr, datesOfThisPeriod.length, true),
        shortLabel = dateUtils.dayAsLabel(dateStr, datesOfThisPeriod.length),
        entry = listOfMatrices[index] || {},
        totalApproved = 0,
        totalTranslated = 0,
        totalNeedsWork = 0;

      while (entry['savedDate'] === dateStr) {
        switch (entry['savedState']) {
          case 'Approved':
            totalApproved += entry['wordCount'];
            break;
          case 'Translated':
            totalTranslated += entry['wordCount'];
            break;
          case 'NeedReview':
            totalNeedsWork += entry['wordCount'];
            break;
          default:
            throw new Error('unrecognized state:' + entry['savedState']);
        }
        index++;
        entry = listOfMatrices[index] || {}
      }

      result.push(
        {
          date: dateStr,
          totalApproved: totalApproved,
          totalTranslated: totalTranslated,
          totalNeedsWork: totalNeedsWork,
          totalActivity: totalApproved + totalNeedsWork + totalTranslated
        });
    });

    return result;
  }


};

export default DataFilters;
