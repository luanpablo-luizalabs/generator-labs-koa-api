const assert = require('chai').assert
const expect = require('chai').expect
const sinon = require('sinon')

const app = require('../../server')
const request = require('supertest').agent(app.listen())

const pjson = require('../../../package.json')
const logger = require('../../middleware/log')

const logData = {text: 'testing API Burzum log'}

describe('log resource', () => {
  describe('Log routes', () => {
    it('does not call the burzum log - since nothing was sent', (done) => {
      const burzumSpy = sinon.spy(logger, 'info')

      request.post('/logs')
        .expect(200)
        .expect('x-api-version', pjson.version)
        .end((err, res) => {
          burzumSpy.restore()

          if (err) throw err

          expect(res.body).to.include.all.keys(['meta', 'records'])
          expect(res.body.records[0]).to.include.all.keys(['status'])

          assert.strictEqual(err, null, 'error is null')
          assert.strictEqual(res.body.records[0].status, 'OK', 'logs response is OK')

          assert.strictEqual(burzumSpy.called, false)

          done()
        })
    })

    it('calls the burzum log', (done) => {
      const burzumStub = sinon.stub(logger, 'info')

      request.post('/logs')
        .send(logData)
        .expect(200)
        .expect('x-api-version', pjson.version)
        .end((err, res) => {
          burzumStub.restore()

          if (err) throw err

          expect(res.body).to.include.all.keys(['meta', 'records'])
          expect(res.body.records[0]).to.include.all.keys(['status'])

          assert.strictEqual(err, null, 'error is null')
          assert.strictEqual(res.body.records[0].status, 'OK', 'logs response is OK')

          logData.env = process.env.NODE_ENV

          sinon.assert.calledOnce(burzumStub)
          sinon.assert.calledWith(burzumStub, logData)

          done()
        })
    })
  })
})
