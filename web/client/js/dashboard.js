async function showGuilds(guildID) {
    setLoading(mainContent)

    const temp = await getTemplate('servers')
    const {guilds, guild_card} = await getGuildsDatas(tokens)
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


// guild settings editor
async function editSRV(guild, guildContainer, event) {
    setLoading(guildContainer)

    const icon = document.querySelector('link[rel="shortcut icon"]')
    icon.href = guild.guild.icon

    let editor = await getTemplate('editor')
    for(let infos in guild.guild) {
        editor= editor.split('>' + infos).join(guild.guild[infos])
    }
    setLoading()

    const dashboardContainer = document.querySelector('.dashboard')
    dashboardContainer.innerHTML= editor

    imgDetect()

    const a = document.createElement('p')
    a.addEventListener('click', () => {
        setTimeout(() => {
            a.parentElement.removeChild(a)
        }, 100);
        showGuilds()
    })
    a.innerText= "servers list"
    document.querySelector('nav').insertBefore(a, document.querySelector('nav').firstChild)

    const settings = (await getGuildSettings(guild.guild.id)).value
    // salon inchangeable depuis le dashboard
    if(settings.channel) delete settings.channel

    const form = document.querySelector('form')
    // form create
    const baseSettings = (await getVars()).settings
    const typeInputsBySetting = {
        string: "text",
        number: "number",
        boolean: "checkbox",
        object: "text" 
    }

    function getType(setting) {
        return typeof baseSettings[setting].value
    }

    function changeType(setting, element) {
        if(getType(setting) === "string") return element
        else if(getType(setting) === "boolean") return element.toString() === "true"
        else if(getType(setting) === "object") {
            if(typeof element === "object") {
                return element.join(',')
            }else {
                if(!element) return []
                else return element.split(',')
            }
        }
        else return element
    }
    
    for(let setting in settings) {
        const settingContainer = document.createElement('div')
        settingContainer.classList.add('setting-container')

        const settingType = getType(setting)
        const type = typeInputsBySetting[settingType]
        const hint = baseSettings[setting].desc

        const settingName = document.createElement('h3')
        settingName.innerText = setting

        const label = document.createElement('label')
        label.for = setting
        label.innerText = hint

        const input = document.createElement('input')
        input.type = type
        input.placeholder = "Change your setting"
        input.name = setting
        input.id = setting

        const value = changeType(setting, settings[setting])
        if(type === "checkbox") input.checked = value
        else input.value = value

        label.append(input)

        settingContainer.appendChild(settingName)
        settingContainer.appendChild(label)

        form.insertBefore(settingContainer, form.children[form.children.length])
    }
    
    // form submit
    form.onsubmit = async (e) => {
        e.preventDefault()

        form.classList.add('saving')


        let query= {
            guildID: guild.guild.id,
            settings: {settings: {}}
        }
        form.querySelectorAll('*[name]').forEach(e => {
            if(e.type === "checkbox") {
                var value = changeType(e.name, e.checked)
            }else {
                var value = changeType(e.name, e.value)
            }

            query.settings.settings[e.name]= value
        })

        const success = await fetch('/save', {
            method: form.method,
            body: JSON.stringify(query)
        }).then(res=> res.json()).then(res => {
            return res.code === 200
        })

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
            true: "Your settings is now saved!",
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