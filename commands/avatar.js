module.exports = {
    name: "avatar",
    alias: ["picture", "pic"],
    description: "Get the profile avatar of a user",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#BB31D6",
    arguments: "([mention] or [id] or [username] or [nickname])",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let userAvatar = e.author
        if(args[0]) {
            userAvatar = e.mentions.users.first()
            if(!userAvatar) {
                userAvatar = e.guild.members.cache.get(args[0]) || e.guild.members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLowerCase()) || e.guild.members.cache.find(m => m.nickname ? m.nickname.toLowerCase() === args.join(' ').toLowerCase() : null)
                
                if(userAvatar) {
                    userAvatar = userAvatar.user
                }else {
                    return e.reply("Who is this user ?")
                }
            }
        }

        if(!userAvatar.avatar) return e.reply('This user doesn\'t have avatar picture!')

        let embed = new vars.discord.MessageEmbed()
        .setDescription(`This is the avatar of <@${userAvatar.id}>`)
        .setImage(userAvatar.avatarURL({dynamic: true, size: 4096}))
        .setColor(e.guild.members.cache.get(userAvatar.id).roles.highest.color || "RANDOM")

        e.channel.send(embed)
    }
}