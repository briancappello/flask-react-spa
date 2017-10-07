const chalk = require('chalk')
const ip = require('ip')

const divider = chalk.gray('-----------------------------------')

/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {

  // Called whenever there's an error on the server we want to print
  error: (err) => {
    console.error(chalk.red(err))
  },

  // Called when express.js app starts on given port w/o errors
  appStarted: (host, frontendPort, backendHost, backendPort, tunnelStarted) => {
    console.log(`Server started ! ${chalk.green('✓')}`)

    // If the tunnel started, log that and the URL it's available at
    if (tunnelStarted) {
      console.log(`Tunnel initialised ${chalk.green('✓')}`)
    }

    console.log(`\n${chalk.bold('Access URLs:')}`)
    console.log(divider)
    console.log(`\
Localhost: ${chalk.yellow(`http://${host}:${frontendPort}`)}
      LAN: ${chalk.yellow(`http://${ip.address()}:${frontendPort}`)}`)
    if (tunnelStarted) {
      console.log(`\
    Proxy: ${chalk.yellow(tunnelStarted)}`)
    }
    console.log(divider)
    console.log(`${chalk.bold('Backend URLs:')}`)
    console.log(divider)
    console.log(`\
API proxy: ${chalk.yellow(`http://${backendHost}:${backendPort}`)}`)
    console.log(divider)
console.log(`${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}\n`)
  },
}

module.exports = logger
