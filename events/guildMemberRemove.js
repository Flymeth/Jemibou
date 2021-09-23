const {getSettings} = require('../commands/settings')
const {get} = require('../tools/getVariablesContent')
module.exports = {
    name: "guildMemberRemove",
    description: "when a member leave a guild",
    active: true,
    run: async (e, vars) => {
        let settings = await getSettings(e.guild.id, vars)

        const executeIfBot = settings.leaveMessageIfBot.toString().toLowerCase() === "true"
        if(!executeIfBot && e.user.bot) return

        let channel = e.guild.channels.cache.get(settings.leaveMessageChannel)
        if(!channel) return

        const variablesContent = await get(e)

        let finalyMsg = settings.leaveMessage
        let variables = vars.configs.settings.variables
        for(let v in variablesContent) {
            finalyMsg = finalyMsg.split(variables.start + v + variables.end).join(variablesContent[v])
        }

        if(channel && finalyMsg) {
            try {
                channel.send(finalyMsg)
            } catch (err) {
                return vars.log(err)
            }
        }
    }
}