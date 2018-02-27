const config = require('./config')

module.exports = Object.keys(config).map(key => config[key])