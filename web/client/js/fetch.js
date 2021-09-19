async function getVars() {
    return fetch('/getVars', {
        method: "GET"
    }).then(res => res.json())
    .then(res => {
        if(res.code === 200) {
            return res.value
        }else return false
    })
}

async function getUser(token) {
    if(!token) return false
    const {type, access} = token
    if(!access || !type) return false

    return fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${type} ${access}`,
            "Content-Type": "application/json"
        }
    }).then(res => {
        if(res.ok) return res.json()
        else return false
    })
}
async function getGuilds(token) {
    if(!token) return false
    const {type, access} = token
    if(!access || !type) return false

    return fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            authorization: `${type} ${access}`,
            "Content-Type": "application/json"
        }
    }).then(res => {
        if(res.ok) return res.json()
        else return false
    })
    .then(async srv => {
        if(!srv) return false
        const filtered = await fetch('/permissions', {
            body: JSON.stringify(srv), 
            method: "POST"
        }).then(r => r.json())
        .then(res => {
            if(res.code === 200) {
                return res.value
            }else return false
        })
        return filtered
    })
}

async function getTemplate(template) {
    if(!template) return false

    return fetch('./templates/' + template).then(res => res.text())
}

async function getGuildSettings(guildId) {
    return await fetch('/getSettings?guild=' + guildId)
    .then(res => res.json())
}