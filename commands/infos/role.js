module.exports = {
    premium: "vip",
    run: (e, vars, args, settings) => {
        if(!args[0]) return e.reply('You need to indicate a role!')

        const role = e.mentions.roles.first() || e.guild.roles.cache.get(args[0]) || e.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(vars.configs.argumentsSeparator).toLowerCase())
        if(!role) return e.reply("I didn't find the role...")

        let members = role.members
        let membersString = ''
        if(members.size) {
            membersString = "(" + members.size + " members)"
            members.forEach(m => {
                membersString += '\n' + m.user.toString()
            })
        }

        let perms = role.permissions
        let permissionsString = ""
        if(perms.has("ADMINISTRATOR")) {
            permissionsString = "`ADMINISTRATOR`"
        }else {
            for(let p of perms) {
                permissionsString+="`" + p + "`\n"
            }
        }

        const roleInformations = {
            "ID": role.id,
            "Display Separatly than other members": role.hoist,
            "Managed by a bot": role.managed,
            "Mentionnable": role.mentionnable,
            "Members": membersString,
            "Permissions": permissionsString,
            "Created at": '```' + `${role.createdAt.getDate()}/${role.createdAt.getMonth()+1}/${role.createdAt.getFullYear()} at ${role.createdAt.getHours()}h${role.createdAt.getMinutes()}` + '```'
        }
        
        let embed = new vars.discord.MessageEmbed()
        .setColor(role.color)
        embed.setDescription(`This is the informations about ${role.toString()}`)

        for(let info in roleInformations) {
            if(!roleInformations[info]) continue
            if(roleInformations[info].length > 1000 && typeof roleInformations[info] === 'string') {
                const txt = roleInformations[info].substr(0, 1000)
                roleInformations[info] = txt + ' [...]'
            }
            embed.addField(info, roleInformations[info])
        }
        e.channel.send(embed)
    }
}