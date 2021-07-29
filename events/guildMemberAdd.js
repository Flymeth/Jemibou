const {getSettings} = require('../commands/settings')
module.exports = {
    name: "guildMemberAdd",
    description: "when a member join a guild",
    active: true,
    run: async (e, vars) => {
        let settings = await getSettings(e.guild.id, vars)
        if(!settings.joinMessage || !settings.joinMessageChannel) return

        let channel = e.guild.channels.cache.get(settings.joinMessageChannel.replace('<#', '').replace('>', ''))
        if(!channel) return

        await e.guild.members.fetch({force: true, cache: true})

        let variablesContent = {
            "user": "<@" + e.id + ">",
            "user.username": e.user.username,
            "user.tag": e.user.tag,
            "user.avatar": e.user.avatarURL() ? e.user.avatarURL({format: "png", dynamic: true, size: 1024}) : "",
            "members.all": e.guild.members.cache.size,
            "members.bots": e.guild.members.cache.filter(m => m.user.bot).size,
            "members.users" : e.guild.members.cache.filter(m => !m.user.bot).size,
            "guild.name": e.guild.name,
            "guild.icon": e.guild.iconURL() ? e.guild.iconURL({format: 'png', dynamic: true, size: 1024}) : ""
        }

        let finalyMsg = settings.joinMessage
        let variables = vars.configs.settings.variables
        for(let v in variablesContent) {
            finalyMsg = finalyMsg.split(variables.start + v + variables.end).join(variablesContent[v])
        }

        try {
            channel.send(finalyMsg)
        } catch (err) {
            return vars.log(err)
        }
    }
}