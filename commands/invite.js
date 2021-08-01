module.exports = {
    name: "invite",
    alias: [""],
    description: "Send the invite link of a bot (or the invite link of Jemibou)",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#6D26DE",
    arguments: "[BOT_MENTION]",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let user;
        if(!args[0]) {
            user = e.guild.me
        }else {
            user = e.mentions.members.first() || e.guild.members.cache.get(args[0]) || e.guild.members.cache.find(u => (u.user.username ? u.user.username.toLowerCase() : null) === args.join(' ').toLowerCase()) || e.guild.members.cache.find(u => (u.nickname ? u.nickname.toLowerCase() : null) === args.join(' ').toLowerCase())
        }
        if(!user || !user.user.bot) return e.reply("You need to indicate a valid discord bot!").then(msg => vars.setEndMessage(msg, "💢"))
        
        let link = `https://discord.com/api/oauth2/authorize?client_id=${user.user.id}&permissions=8&scope=bot`

        let embed = new vars.discord.MessageEmbed()
        .setDescription(`[Click here to invite ${user.displayName}](${link})`)
        .setColor(user.displayColor || this.color || "RANDOM")

        e.channel.send(embed)
    }
}