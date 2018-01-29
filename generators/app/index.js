const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const file = require('file')
const path = require('path')

module.exports = class extends Generator {
  prompting () {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the impeccable ' + chalk.red('generator-labs-koa-api') + ' generator!'
      )
    )

    const gitName = this.user.git.name()
    const gitEmail = this.user.git.email()
    let defaultAuthor = gitName || ''
    if (gitEmail) {
      defaultAuthor += ` <${gitEmail}>`
    }

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'What\'s your project name?',
        default: this.dirname
      }, {
        type: 'input',
        name: 'projectDescription',
        message: 'What is a description for this project?',
        default: 'My awesome API'
      }, {
        type: 'input',
        name: 'projectAuthor',
        message: 'Who is the author of this project?',
        default: defaultAuthor,
        store: true
      }, {
        type: 'input',
        name: 'projectURL',
        message: 'What\'s the project URL?',
        default: '',
        store: true
      }
    ]

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.projectUnderscoredName = props.projectName.replace(/-/g, '_')
      props.projectDisplayName = props.projectUnderscoredName
        .replace(/_/g, ' ')
        .replace(/\b[a-z]/g, (f) => f.toUpperCase())
        .replace(/[aA]pi/, 'API')

      this.props = props
    })
  }

  writing () {
    const src = this.sourceRoot()

    file.walkSync(src, (dirPath, dirs, files) => {
      const relativeDir = path.relative(src, dirPath)

      files.forEach(filename => {
        this.fs.copyTpl(
          this.templatePath(relativeDir, filename),
          this.destinationPath(relativeDir, filename.replace(/^__\./, '.')),
          this.props
        )
      })
    })
  }

  install () {
    this.installDependencies()
  }

  end () {
    this.spawnCommandSync('git', ['init'])
    this.spawnCommandSync('git', ['add', '--all'])
    this.spawnCommandSync('git', ['commit', '-m', '"initial commit from generator"'])
  }
}
