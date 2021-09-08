const {setSettings} = require('../../../commands/settings')

module.exports = {
    url: '/save',
    method: "POST",
    active: true,

    value: (vars, url, chuncks) => {
        const queryPOST = new URLSearchParams(chuncks)

        const channel = vars.client.channels.cache.get(queryPOST.get('channel'))
        if(!channel) return undefined

        const success = setSettings(channel, vars)
        return "saved!"
    }
}