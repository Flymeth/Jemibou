module.exports = {
    name: "kick",
    alias: [],
    description: "Kick a user",
    ownersOnly: false,
    active: true,
    type: "moderation",
    color: "#0600AA",
    deleteCommand: true,
    arguments: "(<member mention> or <member id> or <member name> or <member nickname>) [reason]",
    permissions: {
        bot: ["KICK_MEMBERS"],
        user: ["KICK_MEMBERS"]
    },
    run: async (e, vars, args, settings) => {
        if(!args[0]) return e.reply('You must indicate a member!')

        let user = e.mentions.members.first() || e.guild.members.cache.get(args[0]) || e.guild.members.cache.find(u => (u.user.username ? u.user.username.toLowerCase() : null) === args[0].toLowerCase()) || e.guild.members.cache.find(u => (u.nickname ? u.nickname.toLowerCase() : null) === args[0].toLowerCase())
        if(!user) return e.reply('You need to indicate a valid member!')
        args.shift()
        let unkickable = e.guild.members.cache.get(e.author.id).roles.highest.position < e.guild.members.cache.get(user.id).roles.highest.position || user.id === e.guild.owner.id || user.id === e.author.id
        if(unkickable) {
            let embed = new vars.discord.MessageEmbed()
            .setTitle("I can't kick " + user.user.username + "!")
            .setDescription('It can be the cause of:')
            .addField('The user is above you!', "You can't kick a user who has a role above you")
            .addField('The user is above me!', "I can't kick a user who has a role above me")
            .addField('The user is the guild\'s owner!', "I can't kick the guild's owner")
            .addField('The user is you!', "I can't kick yourself")
            .setColor(vars.configs.colors.invalid)
            return e.channel.send(embed).then(msg => vars.setEndMessage(msg, "↗"))
        }

        const reason = args.join(' ')
        try {
            await user.send("You have been kicked by <@" + e.author.id + ">.\nReason:```" + (reason ? reason : undefined) + "```")
        } catch (err) {
            vars.log(err)
            e.reply('I can not send message to this user...')
        }
        try {
            let reason = args.join(' ')
            await user.kick(reason)
            e.reply('User kicked!').then(msg => vars.setEndMessage(msg, "🎃"))
        } catch (err) {
            vars.log(err)
            e.reply('An error has occured!')
        }
    }
}