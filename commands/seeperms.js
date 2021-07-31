module.exports = {
    name: "seePerms",
    alias: ["perms", "permissions", "getperms"],
    description: "See the permission of a member on the server. You can also use this command to now my permission by use it without mention a member.",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#3F64E5",
    deleteCommand: true,
    arguments: "([mention] or [id] or [username] or [nickname])",
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let user;
        if(args[0]) {
            user = e.mentions.members.first()
            if(!user) user = e.guild.members.cache.get(args[0]) || e.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLowerCase()) || e.guild.members.cache.find(m => m.nickname ? m.nickname.toLowerCase() === args.join(' ').toLowerCase() : null)
            if(!user) return e.reply('I have not found this member...')
        }else {
            user = e.member
        }

        let perms = user.permissions
        let msg = ""

        if(perms.has("ADMINISTRATOR")) {
            msg = "`ADMINISTRATOR`"
        }else {
            for(let p of perms) {
                msg+="`" + p + "`\n"
            }
        }

        let embed = new vars.discord.MessageEmbed()
        .setTitle('This is the permission of ' + (user.nickname || user.user.username))
        .setDescription(msg)
        .setColor(this.color || "RANDOM")

        e.channel.send(embed)
    }
}