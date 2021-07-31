module.exports = {
    premium: "vip+",
    run: (e, vars, args, settings) => {
        let user;
        if(args[0]) {
            user = e.mentions.members.first()
            if(!user) user = e.guild.members.cache.get(args[0]) || e.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLowerCase()) || e.guild.members.cache.find(m => m.nickname ? m.nickname.toLowerCase() === args.join(' ').toLowerCase() : null)
            if(!user) return e.reply('Unknow user...')
        }else {
            user = e.member
        }

        const statusEmote = {
            "online": "🟢",
            "idle": "🌙",
            "offline": "⚪",
            "dnd": "🔴",
        }

        const userInformations = {
            "ID": user.id,
            "Bot": user.user.bot,
            "Premium since": user.premiumSince ? `${user.premiumSince.getDate()}/${user.premiumSince.getMonth()}/${user.premiumSince.getFullYear()} at ${user.premiumSince.getHours()}h${user.premiumSince.getMinutes()}` : "",
            "Account created at": `${user.user.createdAt.getDate()}/${user.user.createdAt.getMonth()}/${user.user.createdAt.getFullYear()} at ${user.user.createdAt.getHours()}h${user.user.createdAt.getMinutes()}`,
            "Joined the guild at": `${user.joinedAt.getDate()}/${user.joinedAt.getMonth()}/${user.joinedAt.getFullYear()} at ${user.joinedAt.getHours()}h${user.joinedAt.getMinutes()}`
        }

        const customStatus = user.presence.activities.find(a => a.type === "CUSTOM_STATUS")

        if(customStatus) {
            userInformations[customStatus.name] = (customStatus.emoji ? customStatus.emoji.name + " " : "") + customStatus.state
        }

        const otherAct = user.presence.activities.find(a => a.type !== "CUSTOM_STATUS")

        if(otherAct) {
            userInformations[otherAct.type] = "App: " + otherAct.name + "\n\n> " + otherAct.details + "\n" + otherAct.state
        }

        const embed = new vars.discord.MessageEmbed()
        .setDescription(statusEmote[user.presence.status] + ` Informations about ${user.displayName}`)
        .setColor(user.displayColor || "RANDOM")
        .setThumbnail(user.user.avatarURL({format: 'png', size: 1024, dynamic: true}))

        for(let info in userInformations) {
            if(!userInformations[info]) continue
            embed.addField(info, '```' + userInformations[info] + '```')
        }

        e.channel.send(embed)
    }
}