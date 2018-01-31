const path = require('path')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

describe('generator-labs-koa-api:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ projectName: 'example-api', projectDescription: 'Example API', projectAuthor: 'test', projectURL: 'https://' })
  })

  it('has package.json', () => {
    assert.file(['package.json'])
  })
})
