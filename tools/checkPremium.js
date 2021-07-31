module.exports = {
    name: "check premium",
    description: "check if a user can do a premium command",
    /**
     * 
     * @type {Promise}
     * @param {String} grade The grade name the user need to have 
     * @param {Object} vars The main variables
     * @param {Object} user The user to verify
     * @returns {Boolean} true if it can do, false else
     */
    check: async(grade, vars, user) => {

        if(!grade || !vars || !user) return new Error("A parameter has been forget")

        for(let ownerid of vars.configs.owners) {
            if(ownerid === user.id) {
                return true
            }
        }

        const supportGuild = vars.client.guilds.cache.get(vars.configs.supportGuildID)
        if(!supportGuild) return new Error("Support guild is not valable")

        const role = vars.configs.roles[grade]
        if(!role) return true
        const posRole = role.position

        const members = await supportGuild.members.fetch()

        const member = members.get(user.id)
        if(!member) {
            return false
        }
        let roles = []
        const memberRoles = member.roles.cache
        memberRoles.forEach(r => {
            for(let role in vars.configs.roles) {
                if(r.id === vars.configs.roles[role].id) {
                    roles.push(r)
                }
            }
        })
        if(!roles.length) {
            return false
        }
        let canDoCommand = false
        for(let role of roles) {
            const configsRoles = vars.configs.roles
            for(let r in configsRoles) {
                if(role.id === configsRoles[r].id) {
                    var posUser = configsRoles[r].position
                    break
                }
            }
            if(posUser >= posRole) {
                canDoCommand = true
            }
        }
        if(!canDoCommand) {
            return false
        }
        return true

    }
}