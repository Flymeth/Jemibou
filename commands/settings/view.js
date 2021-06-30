const {getSettings} = require('../settings')
module.exports = {
    name: "view",
    description: "voir les settings",
    run: async(e, vars, args) => {
        let settings = await getSettings(e.guild.id, vars)
        
        if(!settings) {
            return e.reply("ERROR")
        }else {
            let embed = new vars.discord.MessageEmbed()
            .setTitle('This is your active settings:')
            .setColor('RANDOM')
            for(let setting in settings) {
                embed.addField(setting, `\`\`\`${settings[setting]}\`\`\``)
            }

            e.channel.send(embed)
        }
    }
}