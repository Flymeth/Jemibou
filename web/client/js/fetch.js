async function getVars() {
    return fetch('/getVars', {
        method: "GET"
    }).then(res => res.json())
}

async function getUser(token) {
    if(!token) return false
    const {type, access} = token
    if(!access || !type) return false

    return fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${type} ${access}`,
        },
        method: "GET"
    }).then(res => res.json())
}
async function getGuilds(token) {
    if(!token) return false
    const {type, access} = token
    if(!access || !type) return false

    return fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            authorization: `${type} ${access}`,
        },
        method: "GET"
    }).then(res => res.json())
    .then(async srv => {
        const filtered = []
        for(let s of srv) {
            const perms = await fetch('/permissions?code=' + s.permissions).then(r => r.json())
            if(perms.list.find(p => p === "MANAGE_GUILD")) filtered.push(s)
        }
        return filtered
    })
}

async function getTemplate(template) {
    if(!template) return false

    return fetch('./templates/' + template).then(res => res.text())
}