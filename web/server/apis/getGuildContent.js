module.exports = {
    url: '/getGuildDetails',
    method: "GET",
    active: true,

    value: async (vars, url, chuncks) => {
        const guildID = url.searchParams.get('guild')
        if(guildID) {

            const guild = vars.client.guilds.cache.get(guildID)
            if(guild) {
                return {
                    channels: guild.channels.cache.map(c => c),
                    roles: guild.roles.cache.map(r => {
                        r.manageable = r.editable
                        return r
                    }),
                    members: guild.members.cache.map(m => m)
                }
            }
            else return null

        }else return null
    }
}