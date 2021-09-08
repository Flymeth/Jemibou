module.exports = {
    url: '/permissions',
    method: "POST",
    active: true,

    value: (vars, url, chuncks) => {
        if(!chuncks) return undefined

        const servers = JSON.parse(chuncks)

        return servers.filter(srv => {
            const perms = new vars.discord.Permissions(parseInt(srv.permissions)).toArray()
            return perms.find(p => p === "MANAGE_GUILD")
        })
    }
}