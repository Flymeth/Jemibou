const https = require('https')
const fs = require('fs')
const options = require('./configs.json')
module.exports.run = () => {
    const secureOptions = {
        key: fs.readFileSync(options.secures_options.prvtKey),
        cert: fs.readFileSync(options.secures_options.cert)
    }

    https.createServer(secureOptions, (req, res) => {
        res.end('Bot is actually on!')
    }).listen(options.port).on('listening', () => console.log("server is on!"))
}