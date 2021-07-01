const {doneMsg} = require('../tools/doneMSG')
module.exports = {
    name: "roletoall",
    alias: ["rta"],
    description: "Add/remove a specific role to everyone on the server",
    ownersOnly: false,
    active: true,
    type: "moderation",
    color: "#210EFF",
    arguments: "(<add> or <remove>) (<role mention> or <role id> or <role name>)",
    deleteCommand: false,
    permissions: {
        bot: ["MANAGE_ROLES"],
        user: ["MANAGE_ROLES", "MANAGE_GUILD"]
    },
    run:  (e, vars, args, settings) => {

        // type (add or remove)
        let type = args.shift()
        if(!type || type.toLowerCase() !== "add" && type.toLowerCase() !== "remove") return e.reply('ARG. 1 must be "add" or "remove" !')
        type=type.toLowerCase()
        
        // role mention
        if(!args[0]) return e.reply('ARG. 2 must be a role mention or a role id or a role name!')
        let role = e.mentions.roles.first() || e.guild.roles.cache.get(args[0]) || e.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(vars.configs.argumentsSeparator).toLowerCase())
        
        if(role) {
            if(role.position >= e.channel.members.get(vars.client.user.id).roles.highest.position) {
                return e.reply('This role is above me!').then(msg => doneMsg(msg, vars, "👀"))
            }

            if(role.position >= e.channel.members.get(e.author.id).roles.highest.position && e.author.id !== e.guild.ownerID) {
                return e.reply('This role is above you!').then(msg => doneMsg(msg, vars, "👀"))
            }

            if(role.managed) {
                return e.reply("This role is managed by a bot!").then(msg => doneMsg(msg, vars, "👀"))
            }

            e.delete()
            let embed = new vars.discord.MessageEmbed()
            .setTitle('Confirmation...')
            .setDescription(`I'll ${type} the role ${role} to every people (bellow me) in the server. Do you confirm ?`)
            .setColor(role.color || "RANDOM")

            e.reply(embed).then(async msg => {
                await msg.react(vars.configs.reactions.confirm)
                await msg.react(vars.configs.reactions.unconfirm)

                vars.client.on('messageReactionAdd', (reaction, user) => {
                    if(
                        user.id !== e.author.id
                        || user.bot
                        || reaction.message.id !== msg.id
                    ) return
                    
                    msg.delete()
                   
                    if(reaction.emoji.name === vars.configs.reactions.confirm) {
                        let members = e.guild.members.cache
                        var errorMembers = []
                        members.forEach(member => {
                            try {
                                if(type === "add") {
                                    member.roles.add(role)
                                }else {
                                    member.roles.remove(role)
                                }
                            } catch (err) {
                                vars.log(err);
                                errorMembers.push(member)
                            }
                        })
                    }else {
                        return
                    }

                    if(errorMembers.length > 0) {
                        let msg = ""
                        for(let user of errorMembers) {
                            msg+=`- ${user}\n`
                        }

                        let embed = new vars.discord.MessageEmbed()
                        .setTitle('Oups...')
                        .setDescription('Some users is above me:\n' + msg)
                        .setColor(vars.configs.colors.invalid)

                        e.channel.send(embed)
                    }else {
                        let embed = new vars.discord.MessageEmbed()
                        .setTitle('Success!')
                        .setDescription('Operation finished without any issues!')
                        .setColor(vars.configs.colors.valid)

                        e.channel.send(embed).then(msg => {
                            vars.setEndMessage(msg, "💪")
                        })
                    }
                })
            })
        }else {
            e.reply('This role doesn\'t exist!')
        }
    }
}