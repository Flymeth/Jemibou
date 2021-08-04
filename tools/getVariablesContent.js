/**
 * 
 * @param {Object} member the member to get infos of
 * @returns {Object} The variables content
 */
module.exports.get = async (member) => {
    const e = member

    const members = await e.guild.members.fetch({force: true, cache: true})

    const variablesContent = {
        "user": "<@" + e.id + ">",
        "user.username": e.user.username,
        "user.tag": e.user.tag,
        "user.avatar": e.user.avatarURL() ? e.user.avatarURL({format: "png", dynamic: true, size: 1024}) : "",
        "members.bots": members.filter(m => m.user.bot).size,
        "members.users" : members.filter(m => !m.user.bot).size,
        "members.all": members.size,
        "guild.name": e.guild.name,
        "guild.icon": e.guild.iconURL() ? e.guild.iconURL({format: 'png', dynamic: true, size: 1024}) : "",
        "guild.banner": e.guild.iconURL() ? e.guild.bannerURL({format: 'png', dynamic: true, size: 1024}) : "",
        "guild.rulesChannel": e.guild.rulesChannel ? e.guild.rulesChannel.toString() : ""
    }

    return variablesContent
}