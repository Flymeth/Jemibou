async function showGuilds(guildID) {
    setLoading(mainContent)

    const temp = await getTemplate('servers')
    const guild_card = await getTemplate('guild_card')
    if(!user) return register()

    setLoading()
    mainContent.innerHTML = temp

    const guildContainer = document.querySelector('.guilds_list')

    if(!guilds.length) {
        const html = await getTemplate('noGuilds')
        return guildContainer.innerHTML = html
    }

    const {client, configs} = await getVars()
    
    const guildList = []
    for(let guild of guilds) {
        const reachable = client.guilds.find(g => g === guild.id) ? true : false

        guild.icon= `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`

        if(reachable) {
            guild.editLink = window.location.protocol + '//' + window.location.hostname + window.location.pathname + '?guild=' + guild.id
        }else {
            guild.editLink = configs.invite.start + client.user + configs.invite.end + '&guild_id=' + guild.id
        }

        let card = guild_card
        for(let infos in guild) {
            card= card.split('>' + infos).join(guild[infos])
        }
        const g = {
            guild,
            html: card,
            reachable
        }

        guildList.push(g)
    }

    if(guildID) {
        const guild = guildList.find(g => g.guild.id === guildID && g.reachable)
        if(guild) {
            document.cookie = "guild=false"
            return editSRV(guild)
        }
    }

    guildList.sort((a, b) => b.reachable - a.reachable)

    for(let guild of guildList) {

        const containerType = {
            true: 'div',
            false: 'a'
        }

        const container = document.createElement(containerType[guild.reachable])
        container.innerHTML = guild.html
        container.classList.add('guild_container')
        
        if(!guild.reachable) {
            container.href = guild.guild.editLink
            container.target = 'invite'
            container.classList.add('unreachable')
        }
        
        guildContainer.appendChild(container)
    }
    document.querySelectorAll(':not(.unreachable)> .guild').forEach(e => {
        const guild = guildList.find(g => g.guild.id === e.id.replace('g-', ''))
        e.addEventListener('click', (evt) => {
            editSRV(guild, guildContainer, evt)
        })
    })

    // for unknow imgs
    imgDetect()
}