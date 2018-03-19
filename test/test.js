var request = require('request')
var assert = require('assert')
var sd2 = require('../app.js')
var base_url = 'http://localhost:3000/'

describe('SD2 Test', function () {
  describe('GET /', function () {
    it('returns status code 200', function () {
      request.get(base_url, function (error, response, body) {
        if (error) throw error
        assert.equal(200, response.statusCode)
        sd2.closeServer()
        done()
      })
    }) // you can add other it() for other tests
  })
})
