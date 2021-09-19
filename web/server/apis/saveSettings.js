const {setSettings} = require('../../../commands/settings')

module.exports = {
    url: '/save',
    method: "POST",
    active: true,

    value: (vars, url, chuncks) => {
        if(!chuncks) return false

        const {guildID, settings} = JSON.parse(chuncks)
        if(!guildID || !settings) return undefined

        const guild = vars.client.guilds.cache.get(guildID)
        if(!guild) return undefined


        return setSettings(guild, vars, settings)
    }
}