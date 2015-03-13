jest.dontMock('../UserMatrixStore');
jest.dontMock('moment');
jest.dontMock('moment-range');

describe('UserMatrixStore', function() {
  var Request;
  var baseUrl = 'http://localhost/base';
  var responseBody = require('../userStats.json');

  beforeEach(function() {

  });

  it('will load from server if state is empty', function() {
    require('../../constants/Configs').baseUrl = baseUrl;
    var UserMatrixStore = require('../UserMatrixStore');

    UserMatrixStore.addChangeListener(function() {
      expect(UserMatrixStore.getMatrixState().matrix).toEqual(responseBody)
    });

    Request = require('superagent');

    UserMatrixStore.getMatrixState();

    expect(Request._get).toContain(baseUrl);

  });
});
