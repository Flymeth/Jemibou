module.exports.run = (e, vars, args, settings) => {
    if(!args[0]) {
        var channel = e.channel
    }else {
        var channel = e.mentions.channels.first() || e.guild.channels.cache.get(args[0]) || e.guild.channels.cache.find(c => c.name.toLowerCase() === args[0].toLowerCase())
    }

    if(!channel) return e.reply('Unknow channel...')

    const channelInformations = {
        "ID": channel.id,
        "Type": channel.type + " channel",
        "Created at": '```' + `${channel.createdAt.getDate()}/${channel.createdAt.getMonth()}/${channel.createdAt.getFullYear()} at ${channel.createdAt.getHours()}h${channel.createdAt.getMinutes()}` + '```',
        "Category": '```' + (channel.parent ? channel.parent.name : 'without') + '```'
    }

    const embed = new vars.discord.MessageEmbed()
    .setDescription(`Informations about ${channel.toString()}`)

    for(let info in channelInformations) {
        embed.addField(info, channelInformations[info])
    }

    e.channel.send(embed)
}