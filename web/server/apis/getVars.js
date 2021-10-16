const stringify = require('json-stringify-safe')
module.exports = {
    url: '/getVars',
    method: "GET",
    active: true,

    value: (vars, url, chuncks) => {
        let newVars = stringify(vars)
        newVars = JSON.parse(newVars)
        if(url.searchParams.get('users') === null) delete newVars.client.users
        return newVars
    }
}