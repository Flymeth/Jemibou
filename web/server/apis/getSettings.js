const {getSettings} = require('../../../commands/settings')
module.exports = {
    url: '/getSettings',
    method: "GET",
    active: true,

    value: async (vars, url, chuncks) => {
        const guildID = url.searchParams.get('guild')
        if(guildID) {

            const params = await getSettings(guildID, vars, true)
            return params

        }else return null
    }
}