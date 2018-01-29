const os = require('os')

const Util = () => {}

/**
 * Returns the machine IP address
 * @return {string} machine IP address
 */
Util.getIpAddress = () => {
  let interfaces = os.networkInterfaces()
  let addresses = []
  for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
      let address = interfaces[k][k2]
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address)
      }
    }
  }

  return addresses.length > 0 ? addresses[0] : '127.0.0.1'
}

module.exports = Util
