const {getSettings} = require('../commands/settings')
const {get} = require('../tools/getVariablesContent')
module.exports = {
    name: "guildMemberAdd",
    description: "when a member join a guild",
    active: true,
    run: async (e, vars) => {
        let settings = await getSettings(e.guild.id, vars)
        if(!settings.joinMessage || !settings.joinMessageChannel || (!settings.joinMessageIfBot && e.user.bot)) return

        let channel = e.guild.channels.cache.get(settings.joinMessageChannel.replace('<#', '').replace('>', ''))

        const variablesContent = await get(e)

        let finalyMsg = settings.joinMessage
        let finalyDMMsg = settings.joinMessageDM
        let variables = vars.configs.settings.variables
        for(let v in variablesContent) {
            finalyMsg = finalyMsg.split(variables.start + v + variables.end).join(variablesContent[v])
            finalyDMMsg = finalyDMMsg.split(variables.start + v + variables.end).join(variablesContent[v])
        }

        if(finalyDMMsg) {
            try {
                e.send(finalyDMMsg)
            } catch (err) {
                vars.log(err)
            }
        }

        for(let roleTarget of settings.joinAutoRoles) {
            const role = await e.guild.roles.fetch(roleTarget.replace('<@&', '').replace('>',''))
            if(role && role.editable) {
                try {
                    e.roles.add(role)
                } catch (err) {
                    vars.log(err)
                }
            }
        }

        if(channel) {
            try {
                channel.send(finalyMsg)
            } catch (err) {
                return vars.log(err)
            }
        }
    }
}