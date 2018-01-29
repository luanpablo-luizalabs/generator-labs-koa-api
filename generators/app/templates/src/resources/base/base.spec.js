const assert = require('chai').assert
const expect = require('chai').expect

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const pjson = require('../../../package.json')

describe('base resource', function () {
  describe('health check', function () {
    it('returns the API version and status 200', function (done) {
      request.get('/')
        .expect(200)
        .expect('x-api-version', pjson.version)
        .end((err, res) => {
          expect(res.body).to.include.all.keys(['meta', 'records'])
          expect(res.body.records[0]).to.include.all.keys(['version', 'uptime'])

          assert.strictEqual(err, null, 'error is null')
          assert.strictEqual(res.body.records[0].version, pjson.version, 'response is API version')

          done()
        })
    })
  })

  describe('incorrect path accessed', function () {
    it('returns a 404', function (done) {
      request.get('/incorrect-path')
        .expect(404)
        .expect('x-api-version', pjson.version)
        .end((err, res) => {
          assert.strictEqual(err, null, 'error is null')

          expect(res.body).to.deep.equal({
            'developerMessage': 'Resource not found',
            'errorCode': 20023,
            'moreInfo': 'http://www.developer.apiluiza.com.br/errors',
            'userMessage': 'You attempted to get a Resource, but did not find any'
          })

          done()
        })
    })
  })
})
