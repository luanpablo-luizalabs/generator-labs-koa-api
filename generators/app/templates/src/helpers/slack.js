const config = require('config')
const Slack = require('node-slack')
const CircularJSON = require('circular-json')

const utils = require('./utils')

const SlackNotifier = () => {}

SlackNotifier.error = (obj) => {
  obj.attachments = [{
    fallback: 'Required plain-text summary of the attachment.',
    color: '#ff0000',
    fields: [{
      title: 'IP',
      value: utils.getIpAddress(),
      short: false
    },
    {
      title: 'Error',
      value: CircularJSON.stringify(obj.message),
      short: false
    },
    {
      title: 'Stack',
      value: CircularJSON.stringify(obj.stack),
      short: false
    },
    {
      title: 'Type',
      value: obj.name,
      short: false
    }
    ]
  }]

  SlackNotifier.send(obj)
}

SlackNotifier.success = (obj) => {
  obj.attachments = [{
    fallback: 'Required plain-text summary of the attachment.',
    color: '#0277bd',
    fields: [{
      title: 'IP',
      value: utils.getIpAddress(),
      short: false
    },
    {
      title: 'Success',
      value: obj.message,
      short: false
    }
    ]
  }]

  SlackNotifier.send(obj)
}

/**
 * Base function that sends a notification to slack channels
 * @param {Array} obj - array of slack attachments
 */
SlackNotifier.send = (obj) => {
  obj.channels = Array.isArray(obj.channels) ? obj.channels : [obj.channels]

  obj.channels.forEach((channelName) => {
    let channelConfig = config.slack.channels[channelName]
    let slack = new Slack(channelConfig.url)

    slack.send({
      text: process.env.NODE_ENV,
      channel: channelConfig.name,
      username: config.slack.username,
      attachments: obj.attachments
    })
  })
}

module.exports = SlackNotifier
