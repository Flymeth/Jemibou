module.exports = {
    run: (e, vars, args, settings) => {
        let user;
        if(args[0]) {
            user = e.mentions.members.first()
            if(!user) user = e.guild.members.cache.get(args[0]) || e.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLowerCase()) || e.guild.members.cache.find(m => m.nickname ? m.nickname.toLowerCase() === args.join(' ').toLowerCase() : null)
            if(!user) return e.reply('Unknow user...')
        }else {
            user = e.member
        }

        const roles = user.roles.cache
        let stringRoles = '```Count: ' + roles.size + "```"
        roles.sort((a, b) => b.position - a.position).forEach(role => {
            stringRoles += '\n' + role.toString()
        });

        const statusEmote = {
            "online": "🟢",
            "idle": "🌙",
            "offline": "⚪",
            "dnd": "🔴",
        }

        const userInformations = {
            "ID": user.id,
            "Tag": user.user.tag,
            "Nickname": user.nickname,
            "Bot": user.user.bot,
            "Roles": stringRoles,
            "Account created at": `${user.user.createdAt.getDate()}/${user.user.createdAt.getMonth()+1}/${user.user.createdAt.getFullYear()} at ${user.user.createdAt.getHours()}h${user.user.createdAt.getMinutes()}`,
            "Joined the guild at": `${user.joinedAt.getDate()}/${user.joinedAt.getMonth()+1}/${user.joinedAt.getFullYear()} at ${user.joinedAt.getHours()}h${user.joinedAt.getMinutes()}`
        }

        const customStatus = user.presence.activities.find(a => a.type === "CUSTOM_STATUS")

        if(customStatus) {
            userInformations[customStatus.name] = (customStatus.emoji ? customStatus.emoji.name + " " : "") + customStatus.state
        }

        const otherAct = user.presence.activities.find(a => a.type !== "CUSTOM_STATUS")

        if(otherAct) {
            userInformations[otherAct.type] = "App: " + otherAct.name + (otherAct.details ? "\n\n> " + otherAct.details : "") + (otherAct.state ? "\n" + otherAct.state : "")
        }

        const embed = new vars.discord.MessageEmbed()
        .setDescription(statusEmote[user.presence.status] + ` Informations about ${user.user.username}`)
        .setColor(user.displayColor || "RANDOM")
        .setThumbnail(user.user.avatarURL({format: 'png', size: 1024, dynamic: true}))

        for(let info in userInformations) {
            if(!userInformations[info]) continue
            const content = userInformations[info].toString()
            let msg = (content.startsWith("```") ? content : "```" + content + "```")
            embed.addField(info, msg)
        }

        e.channel.send(embed)
    }
}