const stringify = require('json-stringify-safe')

module.exports = {
    url: '/getVars',
    method: "GET",
    active: true,

    value: (vars, url, chuncks) => {
        return vars
    }
}