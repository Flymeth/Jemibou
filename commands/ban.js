module.exports = {
    name: "ban",
    alias: [],
    description: "Ban a user",
    ownersOnly: false,
    active: true,
    type: "moderation",
    color: "#B80000",
    arguments: "(<member mention> or <member id> or <member name> or <member nickname>) [reason]",
    deleteCommand: true,
    permissions: {
        bot: ["BAN_MEMBERS"],
        user: ["BAN_MEMBERS"]
    },
    run: async (e, vars, args, settings) => {  
        if(!args[0]) return e.reply('You must indicate a member!')
        let user = e.mentions.members.first() || e.guild.members.cache.get(args[0]) || e.guild.members.cache.find(u => (u.user.username ? u.user.username.toLowerCase() : null) === args[0].toLowerCase()) || e.guild.members.cache.find(u => (u.nickname ? u.nickname.toLowerCase() : null) === args[0].toLowerCase())
        if(!user) return e.reply('You need to indicate a valid member!')
        args.shift()
        let unbanable = e.guild.members.cache.get(e.author.id).roles.highest.position < e.guild.members.cache.get(user.id).roles.highest.position || user.id === e.guild.owner.id || user.id === e.author.id
        if(unbanable) {
            let embed = new vars.discord.MessageEmbed()
            .setTitle("I can't ban " + user.user.username + "!")
            .setDescription('It can be the cause of:')
            .addField('The user is above you!', "You can't ban a user who has a role above you")
            .addField('The user is above me!', "I can't ban a user who has a role above me")
            .addField('The user is the guild\'s owner!', "I can't ban the guild's owner")
            .addField('The user is you!', "I can't ban yourself")
            .setColor(vars.configs.colors.invalid)
            return e.channel.send(embed).then(msg => vars.setEndMessage(msg, "↗"))
        }

        try {
            await user.send("You have been banned by <@" + e.author.id + ">.\nReason:```" + (reason ? reason : undefined) + "```")
        } catch (err) {
            e.reply('I can not send message to this user...')
        }
        try {
            let reason = args.join(' ')
            await e.guild.members.ban(user, {reason: reason})
            e.reply('User banned!').then(msg => vars.setEndMessage(msg, "🎃"))
        } catch (err) {
            vars.log(err)
            e.reply('An error has occured!')
        }
    }
}