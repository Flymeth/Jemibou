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

async function getUserDatas(token) {
    if(!token) return false
    if(!token.type || !token.access) return false

    return fetch('/getUserDatas', {
        methodl: "POST",
        body: token
    }).then(res => {
        if(res.ok) return res.json()
        else return false
    })
}
async function getAccount(token) {
    if(!token) return false
    
    const {value} = await fetch('/client?token=' + JSON.stringify(token)).then(res => {
        if(res.ok) return res.json()
        else return false
    })
    if(!value || !value.user || !value.guilds) return undefined
    let {user, guilds} = value

    guilds = await fetch('/permissions', {
        body: JSON.stringify(guilds), 
        method: "POST"
    }).then(r => r.json())
    .then(res => {
        if(res.code === 200) {
            return res.value
        }else return false
    })

    return {user, guilds}
}
async function getUser(token) {
    if(!token) return false

    return fetch('/client?token=' + JSON.stringify(token)).then(res => {
        if(res.ok) return res.json()
        else return false
    }).then(elements => elements.value?.user)
}
async function getGuilds(token) {
    if(!token) return false

    return fetch('/client?token=' + JSON.stringify(token)).then(res => {
        if(res.ok) return res.json()
        else return false
    })
    .then(async srv => {
        if(!srv || !srv.value?.guilds) return false
        const filtered = await fetch('/permissions', {
            body: JSON.stringify(srv.value.guilds), 
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
async function getGuildSettings(guildId) {
    return await fetch('/getSettings?guild=' + guildId)
    .then(res => res.json())
}
async function getGuildDetails(guildId) {
    return await fetch('/getGuildDetails?guild=' + guildId)
    .then(res => res.json())
    .then(res => {
        if(res.code === 200) {
            return res.value
        }else return false
    })
}

async function getTemplate(template) {
    if(!template) return false

    return fetch('./templates/' + template).then(res => res.text())
}