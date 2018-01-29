const axios = require('axios')
const sinon = require('sinon')
const app = require('../../server')
const request = require('supertest').agent(app.listen())
const assert = require('chai').assert
const expect = require('chai').expect
const config = require('config')

describe('DB resource', () => {
  it('[POST] run migrate', (done) => {
    let response = [
      `${config.root}/migrations/20180100000000_example.js`
    ]

    request.post('/db/migrate')
      .expect(200)
      .end((err, res) => {
        let stubMigrate = sinon.stub(axios, 'post').resolves([response])
        stubMigrate.restore()
        expect(res.body).to.include.all.keys(['meta', 'records'])

        assert.strictEqual(err, null, 'error is null')

        done()
      })
  })

  it('[POST] run seeds', (done) => {
    let response = [
      `${config.root}/seeds/examples.js`
    ]

    request.post('/db/seeds')
      .expect(200)
      .end((err, res) => {
        let stubMigrate = sinon.stub(axios, 'post').resolves([response])
        stubMigrate.restore()
        expect(res.body).to.include.all.keys(['meta', 'records'])

        assert.strictEqual(err, null, 'error is null')

        done()
      })
  })
})
