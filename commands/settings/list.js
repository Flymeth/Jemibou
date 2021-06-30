const {getSettings} = require('../settings')
module.exports = {
    name: "list",
    description: "Avoir la liste des settings disponible",
    run: async (e, vars, args) => {
        let settings = vars.settings

        let embed = new vars.discord.MessageEmbed()
        .setTitle('Voici la liste des settings disponible:')
        .setColor('RANDOM')
        for(let set in settings) {
            let setting = settings[set]
            if(!setting.modifiable) continue
            let settingValue = await getSettings(e.guild.id, vars)

            embed.addField(set + ' (`' + (settingValue[set] || setting.value) + '`)', "```" + setting.desc + "```")
        }

        e.channel.send(embed)
    }
}