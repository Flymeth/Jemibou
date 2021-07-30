module.exports.run = async (e, vars, args, settings) => {
    const guild = e.guild

    let channels = guild.channels.cache
    const stringChannelsCount = `Text: ${channels.filter(c => c.type === 'text').size}\nVoice: ${channels.filter(c => c.type === 'voice').size}\nCategory: ${channels.filter(c => c.type === 'category').size}`
    channels = channels.sort((a,b) => a.position - b.position).map(c => c)
    const channelTypes = {
        'text': '📜',
        'voice': '🔊',
        'news': '📢',
        'store': '🛒',
        'category': '📁',
    }
    let stringChannels = ''
    for(let c in channels) {
        stringChannels += `\n${channelTypes[channels[c].type]} ${channels[c].name}`
    }

    const emojis = guild.emojis.cache
    let stringEmojis = emojis.size ? `\`\`\`Animated: ${emojis.filter(e => e.animated).size}\nTotal: ${emojis.size}\`\`\`` : ''
    emojis.forEach(e => {
        stringEmojis+= '\n`:' + e.name + ':` => ' + e.toString()
    })

    const roles = guild.roles.cache
    const stringRolesCount = 'Count: ' + roles.size
    let stringRoles = ''
    roles.forEach(role => {
        stringRoles += '\n' + role.name + ' (users: ' + role.members.size + ')'
    });

    const informations = {
        "ID": guild.id,
        "Owner": guild.owner,
        "Created at": '```' + `${guild.createdAt.getDate()}/${guild.createdAt.getMonth()}/${guild.createdAt.getFullYear()} at ${guild.createdAt.getHours()}h${guild.createdAt.getMinutes()}` + '```',
        "Description": guild.description,
        "Channels": '```' + stringChannelsCount + '``` ```' + stringChannels + '```',
        "Afk Channel": guild.afkChannel,
        "Emojis": stringEmojis,
        "Members": "```Users: " + guild.members.cache.filter(m => !m.user.bot).size + "\nBots: " + guild.members.cache.filter(m => m.user.bot).size + "\nTotal: " + guild.memberCount + '```',
        "Roles": '```' + stringRolesCount + '``` ```' + stringRoles + '```'
    }

    let invite = await guild.channels.cache.filter(c => c.type === 'text').first().createInvite({reason: 'infos server command'})

    const embed = new vars.discord.MessageEmbed()
    .setAuthor(`Informations about ${guild.name}:`, guild.iconURL() ? guild.iconURL({format: 'png', size: 1024, dynamic: true}) : "", invite.url)
    .setColor(this.color || "RANDOM")
    .setThumbnail(guild.banner)
    for(let i in informations) {
        if(!informations[i]) continue
        embed.addField(i, informations[i])
    }

    e.channel.send(embed)
}