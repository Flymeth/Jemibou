async function login(token) {
    console.log("LOGIN YOU WITH TOKEN " + token.access)
    
    const temp = await getTemplate('servers')
    const datas = await getGuildsDatas(token)

    mainContent.innerHTML = temp
    showGuilds(datas.user, datas.guilds, datas.guild_card)

    document.querySelectorAll('.disconnect').forEach(e => {
        e.addEventListener('click', (e) => {
            e.preventDefault()
            document.cookie = `${accountCookieName}=false`
            // supprimer le cookie
            window.location.reload()
        })
    })
}

async function getGuildsDatas(token) {
    const user = await getUser(token)
    const guilds = await getGuilds(token)
    const guild_card = await getTemplate('guild_card')
    return {
        user,
        guilds,
        guild_card
    }
}