const {getSettings} = require('../commands/settings')
module.exports = {
    name: "guildMemberRemove",
    description: "when a member leave a guild",
    active: true,
    run: async (e, vars) => {
        let settings = await getSettings(e.guild.id, vars)
        if(!settings.leaveMessage || !settings.leaveMessageChannel) return

        let channel = e.guild.channels.cache.get(settings.leaveMessageChannel.replace('<#', '').replace('>', ''))
        if(!channel) return

        await e.guild.members.fetch({force: true, cache: true})

        let variablesContent = {
            "user": "<@" + e.id + ">",
            "user.username": e.user.username,
            "user.tag": e.user.tag,
            "members.all": e.guild.members.cache.size,
            "members.bots": e.guild.members.cache.filter(m => m.user.bot).size,
            "members.users" : e.guild.members.cache.filter(m => !m.user.bot).size,
            "avatar": e.user.avatarURL() ? e.user.avatarURL({format: "png", dynamic: true, size: 1024}) : ""
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