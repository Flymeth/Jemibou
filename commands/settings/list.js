const {getSettings} = require('../settings')
module.exports = {
    name: "list",
    description: "Settings' list",
    needPerm: false,
    run: async (e, vars, args) => {
        let settings = vars.settings

        const notationsCaracts = {
            "variables": "🔢"
        }

        let embed = new vars.discord.MessageEmbed()
        .setTitle('Settings list:')
        .setColor('RANDOM')

        let settingValue = await getSettings(e.guild.id, vars)
        for(let set in settings) {
            let setting = settings[set]
            if(!setting.modifiable) continue
            let actually = settingValue[set] || setting.value
            if(!actually || actually.length === 0) actually = "unset"

            let extra = ""
            if(setting.variables) extra += notationsCaracts.variables

            if(extra) extra += " - "
            
            if(actually.length > 256) actually = actually.substr(0,240 - (set.length + extra.length)) + ' [...]'

            embed.addField(extra + set + ' (`' + actually + '`)', "```" + setting.desc + "```")
        }

        let notations = '__Notations:__\n'

        let variablesTxt = "\n" + notationsCaracts.variables + " - You can use the following variables:"
        let variables = vars.configs.settings.variables
        for(let variable in variables.list) {
            variablesTxt += `\n> \`${variables.start}${variable}${variables.end}\` => *${variables.list[variable]}*`
        }

        notations+=variablesTxt

        e.reply(notations, {embed})
    }
}