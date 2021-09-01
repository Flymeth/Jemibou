async function showGuilds(user, guilds, guild_card) {
    setLoading()
    
    user.avatar= `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
    document.querySelectorAll('*[data-user]').forEach(el => {
        const need = el.getAttribute('data-user')
        const value = user[need]
        if(el.localName === 'img') {
            el.src= user.avatar
        }else el.innerText = value
    })

    const guildContainer = document.querySelector('.guilds_list')

    if(!guilds.length) {
        const html = await getTemplate('noGuilds')
        return guildContainer.innerHTML = html
    }

    const {client, configs} = await getVars()
    
    const guildList = []
    for(let guild of guilds) {
        guild.icon= `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`

        let card = guild_card
        for(let infos in guild) {
            card= card.split('>' + infos).join(guild[infos])
        }
        const g = {
            guild,
            html: card,
            reachable: client.guilds.find(g => g === guild.id) ? 1 : 0
        }

        guildList.push(g)
    }

    guildList.sort((a, b) => b.reachable - a.reachable)

    for(let guild of guildList) {

        if(!guild.reachable) {

            const container = document.createElement('a')
            container.href = configs.invite.start + client.user + configs.invite.end + '&guild_id=' + guild.guild.id
            container.target = 'invite'
            container.classList.add('unreachable')
            container.innerHTML= guild.html
            guildContainer.appendChild(container)

        }else guildContainer.innerHTML+= guild.html

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

async function editSRV(guild, guildContainer, event) {
    setLoading(guildContainer)

    const icon = document.querySelector('link[rel="shortcut icon"]')
    icon.href = guild.guild.icon

    let editor = await getTemplate('editor')
    for(let infos in guild.guild) {
        editor= editor.split('>' + infos).join(guild.guild[infos])
    }
    setLoading(false)

    const dashboardContainer = document.querySelector('.dashboard')
    dashboardContainer.innerHTML= editor

    imgDetect()

    const a = document.createElement('a')
    a.addEventListener('click', () => {
        window.location.reload()
    })
    a.innerText= "servers list"
    a.href=""
    document.querySelector('nav').insertBefore(a, document.querySelector('nav').firstChild)

    // form
    const form = document.querySelector('form')
    form.onsubmit = async (e) => {
        e.preventDefault()

        form.classList.add('saving')

        let query= ""
        form.querySelectorAll('*[name]').forEach(e => {
            if(query) query+= "&"
            query+= e.name + "=" + e.value
        })

        const success = await fetch(form.action, {
            method: form.method,
            body: query
        }).then(res=> res.text()).then(v=> v == "true")

        form.classList.remove('saving')

        document.querySelectorAll('form .response').forEach(e => e.parentElement.removeChild(e))

        const responseDIV = document.createElement('div')
        const timeout = 5
        const anim = .5
        responseDIV.classList.add('response')
        responseDIV.setAttribute('data-success', success)
        responseDIV.style.setProperty('--timeout', timeout + 's')
        responseDIV.style.setProperty('--closeAnim', anim + 's')

        const successMSG = {
            true: "You settings is now saved!",
            false: "Oups: please verify each settings parameters and re-try!"
        }

        const txt = document.createElement('p')
        txt.innerText = successMSG[success]

        const button = document.createElement('div')
        button.classList = 'cross'
        button.innerHTML = "<i class='fa fa-times'>"

        responseDIV.appendChild(txt)
        responseDIV.appendChild(button)

        form.appendChild(responseDIV)

        const tmout = setTimeout(() => {
            removeReponse()
        }, timeout*1000);

        button.onclick = () => removeReponse();

        function removeReponse() {
            responseDIV.classList.add('closed')
            clearTimeout(tmout)

            setTimeout(() => {
                responseDIV.parentElement.removeChild(responseDIV)
            }, anim*1000);
        }
    }
}