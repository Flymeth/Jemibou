const {getSettings} = require('../settings')
module.exports = {
    name: "list",
    description: "Settings' list",
    needPerm: false,
    run: async (e, vars, args) => {
        let settings = vars.settings

        let embed = new vars.discord.MessageEmbed()
        .setTitle('Settings list:')
        .setColor('RANDOM')
        for(let set in settings) {
            let setting = settings[set]
            if(!setting.modifiable) continue
            let settingValue = await getSettings(e.guild.id, vars)

            let extra = settingValue[set] || setting.value
            if(!extra || extra.length === 0) extra = "unset"

            embed.addField(set + ' (`' + extra + '`)', "```" + setting.desc + "```")
        }

        e.channel.send(embed)
    }
}