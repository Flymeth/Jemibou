module.exports = {
    premium: "vip+",
    run: async (e, vars, args, settings) => {
        const guild = e.guild

        if(!e.guild.me.permissions.has("MANAGE_GUILD")) return e.reply("I need to have the `MANAGE_GUILD` permission!").then(msg => vars.setEndMessage(msg, "🛠", [e]))

        let channels = guild.channels.cache
        const stringChannelsCount = `Text: ${channels.filter(c => c.type === 'text').size}\nVoice: ${channels.filter(c => c.type === 'voice').size}\nCategory: ${channels.filter(c => c.type === 'category').size}`
        const channelTypes = {
            'text': '📜',
            'voice': '🔊',
            'news': '📢',
            'store': '🛒',
            'category': '📁',
        }
        let stringChannels = ''
        let categorised = channels.filter(c => c.type === "category")

        // for the channel that aren't in a category channel
        let uncategorised = channels.filter(c => c.type !== "category" && !c.parent)
        const uncatChannels = [
            uncategorised.filter(c => c.type !== "voice"),
            uncategorised.filter(c => c.type === "voice")
        ]
        for(let c of uncatChannels) {
            c.sort((a, b) => a.position - b.position).forEach(child => {
                stringChannels += `\n${channelTypes[child.type]} ${child.name}`
            })
        }

        // for the others
        categorised.sort((a, b) => a.position - b.position).forEach(c => {
            stringChannels += `\n${channelTypes[c.type]} ${c.name}`
            const channels = [
                c.children.filter(c => c.type !== "voice"),
                c.children.filter(c => c.type === "voice")
            ]
            for(let channel of channels) {
                channel.sort((a, b) => a.position - b.position).forEach(child => {
                    stringChannels += `\n>  ${channelTypes[child.type]} ${child.name}`
                })
            }
        })

        const emojis = guild.emojis.cache
        let stringEmojis = emojis.size ? '\`\`\`' + `Animated: ${emojis.filter(e => e.animated).size}\nTotal: ${emojis.size}` + '\`\`\`' : ''
        emojis.forEach(e => {
            stringEmojis+= '\n**`:' + e.name + ':` => ' + e.toString() + "**"
        })

        const roles = guild.roles.cache
        const stringRolesCount = 'Count: ' + roles.size
        let stringRoles = ''
        roles.sort((a, b) => b.position - a.position).forEach(role => {
            stringRoles += '\n' + role.name + ' (users: ' + role.members.size + ')'
        });

        const informations = {
            "ID": guild.id,
            "Owner": guild.owner,
            "Region": guild.region,
            "Created at": `${guild.createdAt.getDate()}/${guild.createdAt.getMonth()+1}/${guild.createdAt.getFullYear()} at ${guild.createdAt.getHours()}h${guild.createdAt.getMinutes()}`,
            "Description": guild.description,
            "Channels": stringChannelsCount + '\n' + stringChannels,
            "Afk Channel": guild.afkChannel,
            "Boost Tier": guild.premiumTier,
            "Emojis": stringEmojis,
            "Members": "Users: " + guild.members.cache.filter(m => !m.user.bot).size + "\nBots: " + guild.members.cache.filter(m => m.user.bot).size + "\nTotal: " + guild.memberCount,
            "Roles": stringRolesCount + '\n' + stringRoles
        }

        const invites = await guild.fetchInvites()
        let invite = invites.find(inv => !inv.maxAge)
        if(!invite) invite = await guild.channels.cache.filter(c => c.type === 'text').first().createInvite({reason: 'infos server command', maxAge: 300})

        const embed = vars.newEmbed()
        .setAuthor(`Informations about ${guild.name}:`, guild.iconURL() ? guild.iconURL({format: 'png', size: 1024, dynamic: true}) : "", invite.url)
        .setThumbnail(guild.banner)
        .setImage(guild.iconURL({format: 'png', size: 1024, dynamic: true}))
        for(let i in informations) {
            if(!informations[i]) continue
            if(informations[i].length > 1000 && typeof informations[i] === 'string') {
                const txt = informations[i].substr(0, 1000)
                informations[i] = txt + ' [...]'
            }
            if(typeof informations[i] === 'string' && !informations[i].startsWith('\`\`\`')) {
                informations[i] = '```' + informations[i] + '```'
            }
            embed.addField(i, informations[i])
        }

        e.channel.send(embed)
    }
}